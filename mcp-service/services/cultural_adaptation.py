from schemas.adapt import AdaptRequest, AdaptResponse
from schemas.context import Context
from transformers.cultural_adapter import apply_cultural_adaptation, CULTURAL_CONTEXTS, DEFAULT_CONTEXT
from utils.logger import get_logger
import json
import random

log = get_logger("cultural_adaptation_service")

# Example templates for different subjects
MATH_TEMPLATES = {
    "high": [
        "In {region}, {person} is selling {local_item} at the market. If each {local_item} costs {price} {currency}, how much will {quantity} {local_item}s cost?",
        "During {festival} festival in {region}, {person} wants to distribute {local_sweet} to {quantity} friends. If each person gets {amount} {local_sweet}s, how many will {person} need in total?",
        "A train travels from {city1} to {city2}, covering a distance of {distance} kilometers. If it travels at {speed} km/h, how long will the journey take?"
    ],
    "medium": [
        "If you have {quantity} {local_item}s and give away {amount}, how many do you have left?",
        "A recipe for {local_dish} requires {amount} cups of {ingredient}. If you want to make {quantity} servings, how much {ingredient} will you need?",
        "{person} is {distance} kilometers away from {landmark}. If they walk at {speed} km/h, how long will it take to reach there?"
    ],
    "low": [
        "If you have {quantity} items and give away {amount}, how many do you have left?",
        "A recipe requires {amount} cups of an ingredient. If you want to make {quantity} servings, how much will you need?",
        "Someone is {distance} kilometers away from a destination. If they walk at {speed} km/h, how long will it take to reach there?"
    ]
}

SCIENCE_TEMPLATES = {
    "high": [
        "During the {season} in {region}, farmers grow {local_crop}. Explain the process of photosynthesis using {local_crop} as an example.",
        "The {landmark} in {region} experiences erosion due to {natural_factor}. Describe the geological processes involved in this erosion.",
        "In {region}, traditional {craft} uses principles of {scientific_concept}. Explain how this scientific concept applies to the creation of {craft}."
    ],
    "medium": [
        "Plants like {local_plant} found in {region} use photosynthesis to produce food. Explain this process.",
        "The weather in {region} changes during {season}. Describe the water cycle and how it affects local weather patterns.",
        "In {region}, people use {local_tool} for {activity}. Explain the simple machines or scientific principles involved."
    ],
    "low": [
        "Plants use photosynthesis to produce food. Explain this process.",
        "The water cycle affects weather patterns. Describe how this works.",
        "Simple machines make work easier. Explain how levers, pulleys, or inclined planes work."
    ]
}

HISTORY_TEMPLATES = {
    "high": [
        "The {historical_event} had a significant impact on {region}. Discuss how this event shaped the local culture and traditions like {local_tradition}.",
        "The {historical_figure} from {region} is known for {achievement}. Compare their contributions to those of other historical figures from the same period.",
        "The architecture of {landmark} in {region} reflects influences from the {historical_period}. Analyze the cultural and historical elements visible in this structure."
    ],
    "medium": [
        "The history of {region} includes important events like {historical_event}. Describe what happened and why it was significant.",
        "{historical_figure} from {region} is known for {achievement}. Explain their contribution to history.",
        "The {landmark} in {region} was built during {historical_period}. Describe its historical importance."
    ],
    "low": [
        "An important historical event took place in this region. Describe what happened and why it was significant.",
        "A historical figure made important contributions. Explain what they did and why it matters.",
        "A famous landmark has historical importance. Describe when it was built and why it matters."
    ]
}

LANGUAGE_TEMPLATES = {
    "high": [
        "In {local_language}, the phrase '{local_phrase}' means '{translation}'. Write a short story using this phrase that relates to {local_tradition} in {region}.",
        "The literature of {region} includes works like '{local_literature}' by {local_author}. Analyze the themes in this work and how they reflect the culture of {region}.",
        "The {festival} festival in {region} involves a tradition called '{local_tradition}'. Write a dialogue between two people discussing their plans for celebrating this festival."
    ],
    "medium": [
        "In {region}, people speak {local_language}. The word for '{common_word}' is '{local_word}'. Use this word in a sentence.",
        "A popular story in {region} is about {local_character}. Summarize this story and identify its main message.",
        "During {festival} in {region}, people often say '{local_greeting}'. Write a short conversation using this greeting."
    ],
    "low": [
        "Different languages have different words for common things. Learn how to say a common word in another language and use it in a sentence.",
        "Stories often contain messages or morals. Summarize a story and identify its main message.",
        "People use special greetings during holidays. Write a short conversation using a holiday greeting."
    ]
}

# Map subjects to templates
SUBJECT_TEMPLATES = {
    "math": MATH_TEMPLATES,
    "science": SCIENCE_TEMPLATES,
    "history": HISTORY_TEMPLATES,
    "language": LANGUAGE_TEMPLATES,
    # Default to math templates for other subjects
    "general": MATH_TEMPLATES
}


def get_cultural_variables(region: str, subject: str):
    """Get cultural variables for a specific region and subject"""
    cultural_data = CULTURAL_CONTEXTS.get(region, DEFAULT_CONTEXT)
    
    # Common variables for all subjects
    variables = {
        "region": region,
        "language": cultural_data["language"],
        "person": random.choice(["Raj", "Priya", "Amit", "Sunita", "Vikram", "Meera"]),
        "landmark": random.choice(cultural_data["landmarks"]),
        "festival": random.choice(cultural_data["festivals"]),
        "local_item": random.choice(cultural_data["examples"]),
        "local_dish": random.choice(cultural_data["food"]),
        "currency": "rupees" if region in CULTURAL_CONTEXTS else "dollars",
    }
    
    # Subject-specific variables
    if subject.lower() == "math":
        variables.update({
            "price": random.randint(10, 100),
            "quantity": random.randint(2, 20),
            "amount": random.randint(1, 10),
            "distance": random.randint(50, 500),
            "speed": random.randint(30, 100),
            "city1": f"{region} City",
            "city2": "Delhi" if region != "Delhi" else "Mumbai",
            "local_sweet": random.choice(cultural_data["food"]),
            "ingredient": random.choice(["rice", "flour", "sugar", "milk"]),
        })
    elif subject.lower() == "science":
        variables.update({
            "season": random.choice(["summer", "monsoon", "winter", "spring"]),
            "local_crop": random.choice(["rice", "wheat", "cotton", "sugarcane", "tea"]),
            "natural_factor": random.choice(["rain", "wind", "river flow", "human activity"]),
            "craft": random.choice(["pottery", "weaving", "metalwork", "carpentry"]),
            "scientific_concept": random.choice(["friction", "heat transfer", "chemical reactions", "simple machines"]),
            "local_plant": random.choice(["neem", "tulsi", "banyan", "peepal"]),
            "local_tool": random.choice(["plough", "water wheel", "grinding stone", "loom"]),
            "activity": random.choice(["farming", "cooking", "building", "crafting"]),
        })
    elif subject.lower() == "history":
        variables.update({
            "historical_event": random.choice(["Independence Movement", "Mughal Empire", "British Colonization", "Ancient Trade Routes"]),
            "historical_figure": random.choice(["Mahatma Gandhi", "Rani Lakshmibai", "Emperor Ashoka", "Akbar"]),
            "achievement": random.choice(["non-violent resistance", "military leadership", "unification", "cultural reforms"]),
            "historical_period": random.choice(["Medieval Period", "Colonial Era", "Ancient Civilization", "Post-Independence"]),
            "local_tradition": random.choice(["folk dance", "storytelling", "handicrafts", "religious practices"]),
        })
    elif subject.lower() == "language":
        variables.update({
            "local_language": cultural_data["language"],
            "local_phrase": "Namaste" if cultural_data["language"] == "Hindi" else "Greetings",
            "translation": "Hello and respect to you",
            "local_literature": f"Tales of {region}",
            "local_author": f"Famous Author from {region}",
            "local_tradition": random.choice(["storytelling", "poetry recitation", "folk songs"]),
            "common_word": "friend",
            "local_word": "dost" if cultural_data["language"] == "Hindi" else "friend in local language",
            "local_character": f"Folk Hero of {region}",
            "local_greeting": "Namaste" if cultural_data["language"] == "Hindi" else "Local Greeting",
        })
    
    return variables


def adapt_content(request: AdaptRequest) -> AdaptResponse:
    """Adapt content based on cultural context"""
    # Apply cultural adaptation to context
    context = apply_cultural_adaptation(request.context)
    
    # Get adaptation level
    adaptation_level = context.content.adaptation_level.lower()
    if adaptation_level not in ["low", "medium", "high"]:
        adaptation_level = "medium"  # Default to medium if invalid
    
    # Skip adaptation if level is none
    if adaptation_level == "none":
        return AdaptResponse(
            adapted_text=request.lesson_content,
            cached=False,
            personalization_score=0.0,
            personalization_label="No personalization",
            language=context.user.preferred_language,
            region=context.user.region,
            grade=context.user.grade
        )
    
    # Get subject from context
    subject = context.content.subject.lower()
    if subject not in SUBJECT_TEMPLATES:
        subject = "general"  # Default to general if subject not found
    
    # Get templates for subject and adaptation level
    templates = SUBJECT_TEMPLATES[subject][adaptation_level]
    
    # Get cultural variables
    variables = get_cultural_variables(context.user.region, subject)
    
    # Select a random template and format it with variables
    template = random.choice(templates)
    try:
        adapted_text = template.format(**variables)
    except KeyError as e:
        log.error(f"Missing variable in template: {e}")
        # Fallback to original content
        adapted_text = request.lesson_content
    
    # Calculate personalization score based on adaptation level
    personalization_scores = {"low": 0.3, "medium": 0.6, "high": 0.9}
    personalization_score = personalization_scores.get(adaptation_level, 0.5)
    
    # Generate personalization label
    personalization_label = f"{adaptation_level.capitalize()} cultural adaptation"
    
    return AdaptResponse(
        adapted_text=adapted_text,
        cached=False,
        personalization_score=personalization_score,
        personalization_label=personalization_label,
        language=context.user.preferred_language,
        region=context.user.region,
        grade=context.user.grade
    )