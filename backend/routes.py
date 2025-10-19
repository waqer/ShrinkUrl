from flask import Blueprint, request, jsonify, redirect
from models import db, URL
from utils import generate_code, normalize_url

url_blueprint = Blueprint('url_blueprint', __name__)

@url_blueprint.route('/shorten', methods=['POST'])
def shorten_url():
    data = request.get_json()
    long_url = data.get('long_url')

    if not long_url:
        return jsonify({'error': 'Missing URL'}), 400

    long_url = normalize_url(long_url)

    # Check if URL already exists
    existing = URL.query.filter_by(long_url=long_url).first()
    if existing:
        return jsonify({'short_url': f'http://localhost:5000/{existing.code}'})

    # Generate unique code
    code = generate_code()
    while URL.query.filter_by(code=code).first():
        code = generate_code()

    new_url = URL(code=code, long_url=long_url)
    db.session.add(new_url)
    db.session.commit()

    return jsonify({'short_url': f'http://localhost:5000/{code}'})

@url_blueprint.route('/<code>')
def redirect_url(code):
    url = URL.query.filter_by(code=code).first()
    if not url:
        return jsonify({'error': 'URL not found'}), 404

    target = normalize_url(url.long_url)
    return redirect(target)

@url_blueprint.route('/urls', methods=['GET'])
def get_all_urls():
    urls = URL.query.all()
    return jsonify([u.to_dict() for u in urls])

@url_blueprint.route('/urls/<int:url_id>', methods=['DELETE'])
def delete_url(url_id):
    url = URL.query.get(url_id)
    if not url:
        return jsonify({'error': 'URL not found'}), 404

    db.session.delete(url)
    db.session.commit()
    return jsonify({'message': 'URL deleted successfully'})
