import os

from hierarchyapi.settings import API_DIR, MODULE_DIR


def get_valid_modules():
    """
    retrieve a list of valid modules as strings from the __custom__ directory
    in the app components folder. These modules must have a parent directory
    and .js file with the same name.
    :return: List[str]
    """
    path = os.path.dirname(os.path.realpath(__file__)).replace(API_DIR, MODULE_DIR)
    valid_module_names = []
    for dir in os.listdir(path):
        dir_path = os.path.join(os.path.join(path, dir))
        js_file = '{}.js'.format(dir)
        if os.path.isfile(os.path.join(dir_path, js_file)):
            valid_module_names.append(dir)
    return valid_module_names
