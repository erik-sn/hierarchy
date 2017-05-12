import os

BASE_DIR = os.path.dirname(os.path.realpath(__file__)).replace('\\app\\src\\components\\__modules__\\data', '')
DB_PATH = os.path.join(BASE_DIR, 'api\\db.sqlite3')
