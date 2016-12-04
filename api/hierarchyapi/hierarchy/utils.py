import os

from hierarchyapi.settings import API_DIR, MODULE_DIR


def get_valid_modules():
    path = os.path.dirname(os.path.realpath(__file__)).replace(API_DIR, MODULE_DIR)
    valid_module_names = []
    print(path)
    for dir in os.listdir(path):
        dir_path = os.path.join(os.path.join(path, dir))
        js_file = '{}.js'.format(dir)
        if os.path.isfile(os.path.join(dir_path, js_file)):
            valid_module_names.append(dir)
    return valid_module_names
