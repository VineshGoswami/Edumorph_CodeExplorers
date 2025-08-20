import logging
from configs.settings import LOG_LEVEL

def get_logger(name: str):
  logger = logging.getLogger(name)
  if not logger.handlers:
    level = getattr(logging, LOG_LEVEL.upper(), logging.INFO)
    logger.setLevel(level)
    h = logging.StreamHandler()
    h.setLevel(level)
    h.setFormatter(logging.Formatter("%(asctime)s [%(levelname)s] %(name)s: %(message)s"))
    logger.addHandler(h)
  return logger
