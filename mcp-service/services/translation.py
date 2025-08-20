from schemas.translate import TranslateRequest, TranslateResponse
from schemas.context import Context
from transformers.cultural_adapter import apply_cultural_adaptation
from utils.logger import get_logger
from clients.openai_client import chat_adapt
import json

log = get_logger("translation_service")

# Language codes mapping
LANGUAGE_CODES = {
    "en": "English",
    "hi": "Hindi",
    "pa": "Punjabi",
    "ta": "Tamil",
    "te": "Telugu",
    "mr": "Marathi",
    "bn": "Bengali",
    "gu": "Gujarati",
    "kn": "Kannada",
    "ml": "Malayalam",
    "or": "Odia",
    "ur": "Urdu"
}

# Educational domain-specific terminology for each language
EDUCATIONAL_TERMS = {
    "en": {
        "lesson": "lesson",
        "exercise": "exercise",
        "quiz": "quiz",
        "chapter": "chapter",
        "mathematics": "mathematics",
        "science": "science",
        "history": "history",
        "geography": "geography"
    },
    "hi": {
        "lesson": "पाठ",
        "exercise": "अभ्यास",
        "quiz": "प्रश्नोत्तरी",
        "chapter": "अध्याय",
        "mathematics": "गणित",
        "science": "विज्ञान",
        "history": "इतिहास",
        "geography": "भूगोल"
    },
    "pa": {
        "lesson": "ਪਾਠ",
        "exercise": "ਅਭਿਆਸ",
        "quiz": "ਕੁਇਜ਼",
        "chapter": "ਅਧਿਆਇ",
        "mathematics": "ਗਣਿਤ",
        "science": "ਵਿਗਿਆਨ",
        "history": "ਇਤਿਹਾਸ",
        "geography": "ਭੂਗੋਲ"
    }
    # Add more languages as needed
}

async def translate_text(request: TranslateRequest) -> TranslateResponse:
    """
    Translate text with context awareness for educational content
    """
    source_lang = request.source_language or "en"
    target_lang = request.target_language
    
    # Get full language names
    source_lang_name = LANGUAGE_CODES.get(source_lang, source_lang)
    target_lang_name = LANGUAGE_CODES.get(target_lang, target_lang)
    
    log.info(f"Translating from {source_lang_name} to {target_lang_name}")
    
    # Apply cultural adaptation to context if provided
    context = request.context
    if context:
        context = apply_cultural_adaptation(context)
    
    # Prepare prompt for translation
    prompt = f"""
    Translate the following educational content from {source_lang_name} to {target_lang_name}.
    
    IMPORTANT INSTRUCTIONS:
    1. Maintain the educational context and meaning
    2. Preserve all HTML formatting and tags
    3. Keep mathematical formulas, code snippets, and technical terms intact
    4. Use appropriate educational terminology for {target_lang_name}
    5. Ensure the translation is appropriate for the student's grade level
    6. Maintain any cultural references that are present in the original text
    
    TEXT TO TRANSLATE:
    {request.text}
    """
    
    # Add context information if available
    if context:
        prompt += f"""
        
        CONTEXT INFORMATION:
        - Student grade level: {context.user.grade}
        - Subject: {context.content.subject}
        - Region: {context.user.region}
        - Learning style: {context.user.learning_style}
        """
    
    # Use domain-specific terminology if available
    if target_lang in EDUCATIONAL_TERMS:
        terms = EDUCATIONAL_TERMS[target_lang]
        terms_str = "\n".join([f"{k}: {v}" for k, v in terms.items()])
        prompt += f"""
        
        USE THESE DOMAIN-SPECIFIC TERMS:
        {terms_str}
        """
    
    try:
        # Use the OpenAI client for translation
        translated = await chat_adapt(prompt)
        
        if not translated:
            log.error("Translation failed, returning original text")
            return TranslateResponse(
                translated_text=request.text,
                source_language=source_lang,
                target_language=target_lang,
                quality_score=0.0,
                context_preserved=False
            )
        
        # Calculate a simple quality score based on length ratio
        # A good translation should have a similar length ratio to the original
        original_length = len(request.text)
        translated_length = len(translated)
        length_ratio = min(original_length, translated_length) / max(original_length, translated_length)
        quality_score = length_ratio * 0.8 + 0.2  # Scale to 0.2-1.0 range
        
        return TranslateResponse(
            translated_text=translated,
            source_language=source_lang,
            target_language=target_lang,
            quality_score=quality_score,
            context_preserved=True
        )
        
    except Exception as e:
        log.error(f"Translation error: {str(e)}")
        # Return original text in case of error
        return TranslateResponse(
            translated_text=request.text,
            source_language=source_lang,
            target_language=target_lang,
            quality_score=0.0,
            context_preserved=False
        )