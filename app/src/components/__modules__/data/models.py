from collections import namedtuple

Module = namedtuple('Module', 'id name label')

Machine = namedtuple('Machine', 'id name modules')

Data = namedtuple('Data', 'machine module value')