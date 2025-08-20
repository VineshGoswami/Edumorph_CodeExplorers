from schemas.context import Context
from utils.logger import get_logger
import json

log = get_logger("cultural_adapter")

# Cultural context mapping for common regions
CULTURAL_CONTEXTS = {
    "Punjab": {
        "language": "Punjabi",
        "examples": ["farming", "bhangra", "lassi", "wheat fields", "folk tales"],
        "festivals": ["Baisakhi", "Lohri", "Hola Mohalla"],
        "food": ["makki di roti", "sarson da saag", "chole", "lassi"],
        "clothing": ["phulkari", "turban", "salwar kameez"],
        "landmarks": ["Golden Temple", "Jallianwala Bagh", "Wagah Border"]
    },
    "Tamil Nadu": {
        "language": "Tamil",
        "examples": ["classical dance", "temples", "rice fields", "coastal life"],
        "festivals": ["Pongal", "Thai Pusam", "Aadi Perukku"],
        "food": ["idli", "dosa", "sambar", "rasam", "filter coffee"],
        "clothing": ["silk saree", "veshti", "pattu pavadai"],
        "landmarks": ["Meenakshi Temple", "Marina Beach", "Thanjavur Temple"]
    },
    "Maharashtra": {
        "language": "Marathi",
        "examples": ["trading", "bollywood", "urban life", "coastal activities"],
        "festivals": ["Ganesh Chaturthi", "Gudi Padwa", "Diwali"],
        "food": ["vada pav", "puran poli", "misal pav", "modak"],
        "clothing": ["nauvari saree", "dhoti", "pheta"],
        "landmarks": ["Gateway of India", "Ajanta Caves", "Ellora Caves"]
    },
    "West Bengal": {
        "language": "Bengali",
        "examples": ["literature", "art", "river life", "fish farming"],
        "festivals": ["Durga Puja", "Saraswati Puja", "Poila Boishakh"],
        "food": ["rasgulla", "sandesh", "mishti doi", "fish curry"],
        "clothing": ["tant saree", "dhoti", "kurta"],
        "landmarks": ["Victoria Memorial", "Howrah Bridge", "Sundarbans"]
    },
    "Gujarat": {
        "language": "Gujarati",
        "examples": ["business", "textiles", "coastal trade", "diamond industry"],
        "festivals": ["Navratri", "Uttarayan", "Janmashtami"],
        "food": ["dhokla", "thepla", "fafda", "khandvi"],
        "clothing": ["chaniya choli", "kediyun", "bandhani"],
        "landmarks": ["Sabarmati Ashram", "Rann of Kutch", "Somnath Temple"]
    },
    "Karnataka": {
        "language": "Kannada",
        "examples": ["technology", "coffee plantations", "silk production"],
        "festivals": ["Mysore Dasara", "Ugadi", "Makara Sankranti"],
        "food": ["bisi bele bath", "mysore pak", "ragi mudde", "akki roti"],
        "clothing": ["ilkal saree", "panche", "mysore peta"],
        "landmarks": ["Mysore Palace", "Hampi", "Jog Falls"]
    },
    "Rajasthan": {
        "language": "Rajasthani",
        "examples": ["desert life", "royalty", "forts", "handicrafts"],
        "festivals": ["Pushkar Fair", "Desert Festival", "Teej"],
        "food": ["dal baati churma", "gatte ki sabzi", "ker sangri"],
        "clothing": ["ghagra choli", "bandhej", "pagdi"],
        "landmarks": ["Hawa Mahal", "Amber Fort", "Jaisalmer Fort"]
    },
    "Kerala": {
        "language": "Malayalam",
        "examples": ["backwaters", "spice trade", "coconut farming", "ayurveda"],
        "festivals": ["Onam", "Vishu", "Thrissur Pooram"],
        "food": ["appam", "puttu", "kerala fish curry", "avial"],
        "clothing": ["kasavu saree", "mundu", "set mundu"],
        "landmarks": ["Backwaters", "Kovalam Beach", "Padmanabhaswamy Temple"]
    },
    "Uttar Pradesh": {
        "language": "Hindi",
        "examples": ["historical monuments", "religious sites", "agriculture"],
        "festivals": ["Kumbh Mela", "Holi", "Ram Navami"],
        "food": ["kebabs", "chaat", "paan", "thandai"],
        "clothing": ["chikan kurta", "angarkha", "dhoti kurta"],
        "landmarks": ["Taj Mahal", "Varanasi Ghats", "Fatehpur Sikri"]
    },
    "Andhra Pradesh": {
        "language": "Telugu",
        "examples": ["spicy food", "film industry", "coastal activities"],
        "festivals": ["Ugadi", "Sankranti", "Bathukamma"],
        "food": ["biryani", "gongura pickle", "pesarattu", "pulihora"],
        "clothing": ["langa voni", "pancha", "kanduva"],
        "landmarks": ["Tirupati Temple", "Charminar", "Araku Valley"]
    }
}

# Default context for fallback
DEFAULT_CONTEXT = {
    "language": "English",
    "examples": ["general", "universal", "common"],
    "festivals": ["common holidays", "international celebrations"],
    "food": ["common dishes", "international cuisine"],
    "clothing": ["casual wear", "formal attire"],
    "landmarks": ["well-known places", "famous sites"]
}


def apply_cultural_adaptation(ctx: Context) -> Context:
    """
    Enhance context with cultural adaptation parameters
    """
    region = ctx.user.region
    
    # Skip if adaptation level is none
    if ctx.content.adaptation_level == "none":
        log.info(f"Cultural adaptation disabled for user from {region}")
        return ctx
    
    # Get cultural context for the region
    cultural_data = CULTURAL_CONTEXTS.get(region, DEFAULT_CONTEXT)
    
    # Set cultural context in content
    if not ctx.content.cultural_context:
        ctx.content.cultural_context = json.dumps(cultural_data)
    
    # Add user's cultural preferences if they exist
    if ctx.user.cultural_preferences:
        log.info(f"Using custom cultural preferences for user {ctx.user.id}")
    else:
        # Set default preferences based on region
        ctx.user.cultural_preferences = {
            "language": cultural_data["language"],
            "use_local_examples": "true" if ctx.user.local_examples else "false",
            "adaptation_level": ctx.content.adaptation_level
        }
    
    log.info(f"Applied cultural adaptation for {region} at level {ctx.content.adaptation_level}")
    return ctx