import random
import string

def generate_code(length=6):
    """Generate a random short code."""
    chars = string.ascii_letters + string.digits
    return ''.join(random.choices(chars, k=length))

def normalize_url(url):
    """Ensure the URL has a proper scheme."""
    url = url.strip()
    if not url.startswith(('http://', 'https://')):
        url = 'https://' + url
    return url
