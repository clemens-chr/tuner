"""
Helper functions for the application.
"""

from typing import Dict, Any, List, Optional
import logging
import base64
import json
import hashlib
import time
from datetime import datetime

logger = logging.getLogger(__name__)

def setup_logging(log_level: str = "INFO") -> None:
    """
    Set up logging configuration.
    
    Args:
        log_level: Log level as string (DEBUG, INFO, WARNING, ERROR, CRITICAL)
    """
    numeric_level = getattr(logging, log_level.upper(), None)
    if not isinstance(numeric_level, int):
        raise ValueError(f"Invalid log level: {log_level}")
        
    logging.basicConfig(
        level=numeric_level,
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S"
    )

def validate_mime_type(mime_type: str, allowed_types: List[str]) -> bool:
    """
    Validate if a MIME type is allowed.
    
    Args:
        mime_type: MIME type to validate
        allowed_types: List of allowed MIME types
        
    Returns:
        True if allowed, False if not
    """
    return mime_type in allowed_types

def calculate_hash(data: bytes) -> str:
    """
    Calculate SHA-256 hash of binary data.
    
    Args:
        data: Binary data
        
    Returns:
        Hex digest of the hash
    """
    return hashlib.sha256(data).hexdigest()

def format_timestamp(timestamp: Optional[float] = None) -> str:
    """
    Format a timestamp as ISO format string.
    
    Args:
        timestamp: Unix timestamp, current time if None
        
    Returns:
        Formatted timestamp string
    """
    if timestamp is None:
        timestamp = time.time()
    return datetime.fromtimestamp(timestamp).isoformat()

def sanitize_filename(filename: str) -> str:
    """
    Sanitize a filename to be safe for storage.
    
    Args:
        filename: Original filename
        
    Returns:
        Sanitized filename
    """
    # Replace potentially dangerous characters
    safe_filename = "".join(c for c in filename if c.isalnum() or c in "._- ")
    # Ensure it's not too long
    if len(safe_filename) > 255:
        name, ext = os.path.splitext(safe_filename)
        safe_filename = name[:250] + ext
    return safe_filename

def encode_file_to_base64(file_path: str) -> str:
    """
    Encode a file to base64.
    
    Args:
        file_path: Path to the file
        
    Returns:
        Base64 encoded string
    """
    with open(file_path, "rb") as file:
        file_data = file.read()
        encoded = base64.b64encode(file_data).decode("utf-8")
        return encoded

def truncate_text(text: str, max_length: int = 100) -> str:
    """
    Truncate text to a maximum length.
    
    Args:
        text: Text to truncate
        max_length: Maximum length
        
    Returns:
        Truncated text
    """
    if len(text) <= max_length:
        return text
    return text[:max_length] + "..."

def merge_dictionaries(dict1: Dict[str, Any], dict2: Dict[str, Any]) -> Dict[str, Any]:
    """
    Merge two dictionaries recursively.
    
    Args:
        dict1: First dictionary
        dict2: Second dictionary (values override dict1)
        
    Returns:
        Merged dictionary
    """
    result = dict1.copy()
    
    for key, value in dict2.items():
        if key in result and isinstance(result[key], dict) and isinstance(value, dict):
            result[key] = merge_dictionaries(result[key], value)
        else:
            result[key] = value
            
    return result