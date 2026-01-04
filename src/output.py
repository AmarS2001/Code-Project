[
  {
    uuid: "7b256679-4829-4a61-ad23-b50de5c7cb3b",
    filePath: "/Users/amarssajjanshetty/workfolder5/projectV3/test/test.css",
    startLine: 1,
    endLine: 93,
    code: '/*\n * Comprehensive CSS test file for chunking\n * Covers selectors, media queries, animations, variables, etc.\n */\n\n:root {\n  --primary-color: #2d3e50;\n  --accent-color: #ff6f61;\n  --font-stack: "Inter", "Segoe UI", system-ui, sans-serif;\n}\n\n*,\n*::before,\n*::after {\n  box-sizing: border-box;\n}\n\nbody {\n  margin: 0;\n  font-family: var(--font-stack);\n  background: #f5f7fb;\n  color: #1b2330;\n  line-height: 1.5;\n}\n\n/* Layout */\n.app {\n  display: grid;\n  grid-template-columns: 280px 1fr;\n  min-height: 100vh;\n}\n\n.sidebar {\n  background: var(--primary-color);\n  color: #fff;\n  padding: 2rem 1.5rem;\n}\n\n.main {\n  padding: 2rem 3rem;\n}\n\n/* Navigation */\n.nav {\n  list-style: none;\n  padding: 0;\n  margin: 2rem 0 0;\n}\n\n.nav__item {\n  margin-bottom: 0.5rem;\n}\n\n.nav__link {\n  display: block;\n  padding: 0.75rem 1rem;\n  border-radius: 8px;\n  text-decoration: none;\n  color: inherit;\n  transition: background 0.2s ease, transform 0.2s ease;\n}\n\n.nav__link:hover,\n.nav__link--active {\n  background: rgba(255, 255, 255, 0.12);\n  transform: translateX(8px);\n}\n\n/* Cards */\n.card-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));\n  gap: 1.5rem;\n  margin-top: 2rem;\n}\n\n.card {\n  background: #fff;\n  border-radius: 16px;\n  padding: 1.5rem;\n  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);\n  transition: transform 0.3s ease, box-shadow 0.3s ease;\n}\n\n.card:hover {\n  transform: translateY(-6px);\n  box-shadow: 0 30px 50px rgba(0, 0, 0, 0.1);\n}\n\n.card__title {\n  margin: 0 0 0.5rem;\n  font-size: 1.25rem;\n}',
    parentCode:
      "/*\n * Comprehensive CSS test file for chunking\n * Covers selectors, media queries, animations, variables, etc.\n */\n",
    breadcrumb: [],
    nextChunkSnippet:
      ".card__meta {\n  font-size: 0.875rem;\n  color: #6b7280;\n}\n\n.card__actions {\n  margin-top: 1.5rem;\n  display: flex;\n  gap: 0.75rem;\n}",
  },
  {
    uuid: "b533279d-d7e9-4b27-b9ac-a54227e57de8",
    filePath: "/Users/amarssajjanshetty/workfolder5/projectV3/test/test.css",
    startLine: 95,
    endLine: 186,
    code: ".card__meta {\n  font-size: 0.875rem;\n  color: #6b7280;\n}\n\n.card__actions {\n  margin-top: 1.5rem;\n  display: flex;\n  gap: 0.75rem;\n}\n\n.btn {\n  border: none;\n  border-radius: 8px;\n  padding: 0.65rem 1.25rem;\n  font-weight: 600;\n  cursor: pointer;\n  transition: transform 0.2s ease, box-shadow 0.2s ease;\n}\n\n.btn--primary {\n  background: var(--accent-color);\n  color: #fff;\n  box-shadow: 0 10px 20px rgba(255, 111, 97, 0.3);\n}\n\n.btn--ghost {\n  background: transparent;\n  border: 1px solid rgba(17, 24, 39, 0.15);\n  color: #111827;\n}\n\n.btn:hover {\n  transform: translateY(-2px);\n}\n\n.btn:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n  transform: none;\n}\n\n/* Tables */\n.table {\n  width: 100%;\n  border-collapse: collapse;\n  margin-top: 2rem;\n  font-size: 0.95rem;\n}\n\n.table th,\n.table td {\n  padding: 0.85rem 1rem;\n  text-align: left;\n}\n\n.table thead {\n  background: rgba(17, 24, 39, 0.03);\n  text-transform: uppercase;\n  font-size: 0.8rem;\n  letter-spacing: 0.05em;\n}\n\n.table tbody tr {\n  border-bottom: 1px solid rgba(17, 24, 39, 0.05);\n}\n\n.table tbody tr:hover {\n  background: rgba(17, 24, 39, 0.02);\n}\n\n/* Forms */\n.form-group {\n  display: flex;\n  flex-direction: column;\n  gap: 0.35rem;\n  margin-bottom: 1.25rem;\n}\n\n.input {\n  border: 1px solid rgba(17, 24, 39, 0.12);\n  border-radius: 10px;\n  padding: 0.75rem 1rem;\n  font-size: 1rem;\n  transition: border 0.2s ease, box-shadow 0.2s ease;\n}\n\n.input:focus {\n  outline: none;\n  border-color: var(--accent-color);\n  box-shadow: 0 0 0 3px rgba(255, 111, 97, 0.2);\n}",
    parentCode:
      "/*\n * Comprehensive CSS test file for chunking\n * Covers selectors, media queries, animations, variables, etc.\n */\n",
    breadcrumb: [],
    previousChunkSnippet:
      "\n.card:hover {\n  transform: translateY(-6px);\n  box-shadow: 0 30px 50px rgba(0, 0, 0, 0.1);\n}\n\n.card__title {\n  margin: 0 0 0.5rem;\n  font-size: 1.25rem;\n}",
    nextChunkSnippet:
      ".input--error {\n  border-color: #ef4444;\n  background: rgba(239, 68, 68, 0.05);\n}\n\n.input--success {\n  border-color: #22c55e;\n  background: rgba(34, 197, 94, 0.05);\n}\n",
  },
  {
    uuid: "c6d6d181-b5ac-4ee1-8655-968f1495f3ab",
    filePath: "/Users/amarssajjanshetty/workfolder5/projectV3/test/test.css",
    startLine: 188,
    endLine: 277,
    code: '.input--error {\n  border-color: #ef4444;\n  background: rgba(239, 68, 68, 0.05);\n}\n\n.input--success {\n  border-color: #22c55e;\n  background: rgba(34, 197, 94, 0.05);\n}\n\n/* Chips */\n.chip {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.35rem;\n  padding: 0.35rem 0.65rem;\n  border-radius: 999px;\n  font-size: 0.8rem;\n  background: rgba(17, 24, 39, 0.06);\n}\n\n.chip--success {\n  color: #15803d;\n  background: rgba(34, 197, 94, 0.15);\n}\n\n.chip--warning {\n  color: #b45309;\n  background: rgba(251, 191, 36, 0.2);\n}\n\n.chip--danger {\n  color: #b91c1c;\n  background: rgba(248, 113, 113, 0.2);\n}\n\n/* Media queries */\n@media (max-width: 900px) {\n  .app {\n    grid-template-columns: 1fr;\n  }\n\n  .sidebar {\n    position: sticky;\n    top: 0;\n    z-index: 10;\n  }\n}\n\n@media (max-width: 640px) {\n  .main {\n    padding: 1.5rem;\n  }\n\n  .card-grid {\n    grid-template-columns: 1fr;\n  }\n}\n\n/* Animations */\n@keyframes shimmer {\n  0% {\n    transform: translateX(-100%);\n  }\n  100% {\n    transform: translateX(100%);\n  }\n}\n\n.skeleton {\n  position: relative;\n  overflow: hidden;\n  background: rgba(17, 24, 39, 0.06);\n}\n\n.skeleton::after {\n  content: \\"\\";\n  position: absolute;\n  inset: 0;\n  transform: translateX(-100%);\n  background: linear-gradient(\n    120deg,\n    transparent,\n    rgba(255, 255, 255, 0.4),\n    transparent\n  );\n  animation: shimmer 1.3s infinite;\n}\n\n/* Dark mode */',
    parentCode:
      "/*\n * Comprehensive CSS test file for chunking\n * Covers selectors, media queries, animations, variables, etc.\n */\n",
    breadcrumb: [],
    error: [
      'error: Has error at line number 264 at node or : \\"\\";   position',
      "error: Has error at line number 265 at node or position",
    ],
    previousChunkSnippet:
      "  padding: 0.75rem 1rem;\n  font-size: 1rem;\n  transition: border 0.2s ease, box-shadow 0.2s ease;\n}\n\n.input:focus {\n  outline: none;\n  border-color: var(--accent-color);\n  box-shadow: 0 0 0 3px rgba(255, 111, 97, 0.2);\n}",
    nextChunkSnippet:
      "@media (prefers-color-scheme: dark) {\n  body {\n    background: #0f172a;\n    color: #f8fafc;\n  }\n\n  .card {\n    background: #1e293b;\n    color: inherit;\n  }",
  },
  {
    uuid: "da940e4b-485e-471d-8605-9d211d8affd3",
    filePath: "/Users/amarssajjanshetty/workfolder5/projectV3/test/test.css",
    startLine: 278,
    endLine: 300,
    code: "@media (prefers-color-scheme: dark) {\n  body {\n    background: #0f172a;\n    color: #f8fafc;\n  }\n\n  .card {\n    background: #1e293b;\n    color: inherit;\n  }\n\n  .card__meta {\n    color: rgba(248, 250, 252, 0.6);\n  }\n\n  .table thead {\n    background: rgba(248, 250, 252, 0.05);\n  }\n\n  .table tbody tr {\n    border-bottom-color: rgba(248, 250, 252, 0.08);\n  }\n}",
    parentCode:
      "/*\n * Comprehensive CSS test file for chunking\n * Covers selectors, media queries, animations, variables, etc.\n */\n",
    breadcrumb: [],
    previousChunkSnippet:
      "  background: linear-gradient(\n    120deg,\n    transparent,\n    rgba(255, 255, 255, 0.4),\n    transparent\n  );\n  animation: shimmer 1.3s infinite;\n}\n\n/* Dark mode */",
  },
]

[
  ({
    uuid: "c1fcfb6e-3f9b-4aad-8ca8-a8ac8a752b04",
    filePath: "/Users/amarssajjanshetty/workfolder5/projectV3/test/test.py",
    startLine: 1,
    endLine: 66,
    code: '"""\nThis is a comprehensive test file for the code chunker.\nIt contains various Python components to test AST parsing and chunking.\n"""\n\n# Standard library imports\nimport os\nimport sys\nfrom typing import List, Dict, Optional, Union\nfrom datetime import datetime\nfrom pathlib import Path\n\n# Third-party imports\nimport requests\nimport json\n\n# Module-level constants\nAPI_BASE_URL = "https://api.example.com"\nMAX_RETRIES = 3\nDEFAULT_TIMEOUT = 30\n\n# Module-level variables\nglobal_counter = 0\nconfig_data = {}\ninitialized = False\n\n\ndef simple_function(x: int, y: int) -> int:\n    """Simple function that adds two numbers.\n    \n    Args:\n        x: First number\n        y: Second number\n    \n    Returns:\n        Sum of x and y\n    """\n    return x + y\n\n\ndef function_with_defaults(name: str = "Guest", age: int = 18) -> str:\n    """Function with default parameters."""\n    return f"{name} is {age} years old"\n\n\ndef complex_function(\n    items: List[str],\n    config: Dict[str, any],\n    callback: Optional[callable] = None\n) -> Union[List[str], None]:\n    """\n    Complex function with multiple parameters and type hints.\n    \n    This function processes a list of items with configuration.\n    """\n    results = []\n    \n    # Process each item\n    for item in items:\n        if callback:\n            processed = callback(item)\n            results.append(processed)\n        else:\n            results.append(item.upper())\n    \n    return results if results else None',
    parentCode:
      '"""\nThis is a comprehensive test file for the code chunker.\nIt contains various Python components to test AST parsing and chunking.\n"""\n',
    breadcrumb: [],
    nextChunkSnippet:
      'def function_with_control_flow(data: List[int]) -> Dict[str, int]:\n    """Function demonstrating control flow structures."""\n    stats = {"sum": 0, "max": 0, "min": float(\'inf\'), "count": 0}\n    \n    # If-else logic\n    if not data:\n        return stats\n    \n    # Loop with conditions\n    for num in data:',
  },
  {
    uuid: "27b7a80f-fa06-451a-998e-f781f91665ef",
    filePath: "/Users/amarssajjanshetty/workfolder5/projectV3/test/test.py",
    startLine: 69,
    endLine: 95,
    code: 'def function_with_control_flow(data: List[int]) -> Dict[str, int]:\n    """Function demonstrating control flow structures."""\n    stats = {"sum": 0, "max": 0, "min": float(\'inf\'), "count": 0}\n    \n    # If-else logic\n    if not data:\n        return stats\n    \n    # Loop with conditions\n    for num in data:\n        if num > stats["max"]:\n            stats["max"] = num\n        if num < stats["min"]:\n            stats["min"] = num\n        stats["sum"] += num\n        stats["count"] += 1\n    \n    # Try-except block\n    try:\n        stats["average"] = stats["sum"] / stats["count"]\n    except ZeroDivisionError:\n        stats["average"] = 0\n    \n    return stats\n\n\n# Simple class definition',
    parentCode:
      '"""\nThis is a comprehensive test file for the code chunker.\nIt contains various Python components to test AST parsing and chunking.\n"""\n',
    breadcrumb: [],
    previousChunkSnippet:
      "    \n    # Process each item\n    for item in items:\n        if callback:\n            processed = callback(item)\n            results.append(processed)\n        else:\n            results.append(item.upper())\n    \n    return results if results else None",
    nextChunkSnippet:
      'class Person:\n    """Represents a person with basic information."""\n    \n    # Class variable\n    species = "Homo sapiens"\n    \n    def __init__(self, name: str, age: int, email: Optional[str] = None):\n        """Initialize a Person instance.\n        \n        Args:',
  },
  {
    uuid: "e3e4327c-d1a3-4a94-ab82-0d6f79b1bab2",
    filePath: "/Users/amarssajjanshetty/workfolder5/projectV3/test/test.py",
    startLine: 96,
    endLine: 142,
    code: 'class Person:\n    """Represents a person with basic information."""\n    \n    # Class variable\n    species = "Homo sapiens"\n    \n    def __init__(self, name: str, age: int, email: Optional[str] = None):\n        """Initialize a Person instance.\n        \n        Args:\n            name: Person\'s full name\n            age: Person\'s age\n            email: Optional email address\n        """\n        self.name = name\n        self.age = age\n        self.email = email\n        self._private_field = "hidden"\n    \n    def greet(self) -> str:\n        """Return a greeting message."""\n        return f"Hello, I\'m {self.name} and I\'m {self.age} years old"\n    \n    def get_info(self) -> Dict[str, any]:\n        """Get person information as dictionary."""\n        return {\n            "name": self.name,\n            "age": self.age,\n            "email": self.email\n        }\n    \n    @property\n    def is_adult(self) -> bool:\n        """Check if person is an adult."""\n        return self.age >= 18\n    \n    @staticmethod\n    def from_dict(data: Dict[str, any]) -> \'Person\':\n        """Create Person instance from dictionary."""\n        return Person(\n            name=data.get("name", ""),\n            age=data.get("age", 0),\n            email=data.get("email")\n        )\n\n\n# Complex class with inheritance',
    parentCode:
      '"""\nThis is a comprehensive test file for the code chunker.\nIt contains various Python components to test AST parsing and chunking.\n"""\n',
    breadcrumb: [],
    previousChunkSnippet:
      '    # Try-except block\n    try:\n        stats["average"] = stats["sum"] / stats["count"]\n    except ZeroDivisionError:\n        stats["average"] = 0\n    \n    return stats\n\n\n# Simple class definition',
    nextChunkSnippet: "class Employee(Person):",
  },
  {
    uuid: "7cdd09a2-fbc5-48bb-988f-c52fb21143ac",
    filePath: "/Users/amarssajjanshetty/workfolder5/projectV3/test/test.py",
    startLine: 143,
    endLine: 143,
    code: "class Employee(Person):",
    parentCode:
      'class Employee(Person):\n    """Represents an employee, extending Person."""\n    \n    def __init__(\n        self,',
    breadcrumb: ["Employee"],
    previousChunkSnippet:
      '    def from_dict(data: Dict[str, any]) -> \'Person\':\n        """Create Person instance from dictionary."""\n        return Person(\n            name=data.get("name", ""),\n            age=data.get("age", 0),\n            email=data.get("email")\n        )\n\n\n# Complex class with inheritance',
    nextChunkSnippet:
      '"""Represents an employee, extending Person."""\n    \n    def __init__(\n        self,\n        name: str,\n        age: int,\n        employee_id: str,\n        department: str,\n        salary: float,\n        email: Optional[str] = None',
  },
  {
    uuid: "64921337-dde5-4947-a299-7fc11be918f5",
    filePath: "/Users/amarssajjanshetty/workfolder5/projectV3/test/test.py",
    startLine: 144,
    endLine: 191,
    code: '"""Represents an employee, extending Person."""\n    \n    def __init__(\n        self,\n        name: str,\n        age: int,\n        employee_id: str,\n        department: str,\n        salary: float,\n        email: Optional[str] = None\n    ):\n        """Initialize an Employee instance.\n        \n        Args:\n            name: Employee\'s name\n            age: Employee\'s age\n            employee_id: Unique employee identifier\n            department: Department name\n            salary: Annual salary\n            email: Optional email address\n        """\n        super().__init__(name, age, email)\n        self.employee_id = employee_id\n        self.department = department\n        self.salary = salary\n        self._performance_score = 0.0\n    \n    def calculate_bonus(self, multiplier: float = 0.1) -> float:\n        """Calculate bonus based on salary and multiplier.\n        \n        Args:\n            multiplier: Bonus multiplier (default 0.1 = 10%)\n        \n        Returns:\n            Calculated bonus amount\n        """\n        return self.salary * multiplier\n    \n    def update_performance(self, score: float) -> None:\n        """Update employee performance score.\n        \n        Args:\n            score: Performance score (0.0 to 1.0)\n        """\n        if 0.0 <= score <= 1.0:\n            self._performance_score = score\n        else:\n            raise ValueError("Performance score must be between 0.0 and 1.0")',
    parentCode:
      '"""Represents an employee, extending Person."""\n    \n    def __init__(\n        self,\n        name: str,',
    breadcrumb: ["Employee"],
    previousChunkSnippet: "class Employee(Person):",
    nextChunkSnippet:
      'def get_performance(self) -> float:\n        """Get current performance score."""\n        return self._performance_score\n    \n    def promote(self, new_department: str, salary_increase: float) -> None:\n        """Promote employee to new department with salary increase."""\n        self.department = new_department\n        self.salary += salary_increase\n    \n    @classmethod',
  },
  {
    uuid: "04401f74-a518-4171-862a-1777de00c572",
    filePath: "/Users/amarssajjanshetty/workfolder5/projectV3/test/test.py",
    startLine: 193,
    endLine: 211,
    code: 'def get_performance(self) -> float:\n        """Get current performance score."""\n        return self._performance_score\n    \n    def promote(self, new_department: str, salary_increase: float) -> None:\n        """Promote employee to new department with salary increase."""\n        self.department = new_department\n        self.salary += salary_increase\n    \n    @classmethod\n    def create_manager(cls, name: str, age: int, employee_id: str) -> \'Employee\':\n        """Create a manager employee with default settings."""\n        return cls(\n            name=name,\n            age=age,\n            employee_id=employee_id,\n            department="Management",\n            salary=100000.0\n        )',
    parentCode:
      '"""Represents an employee, extending Person."""\n    \n    def __init__(\n        self,\n        name: str,',
    breadcrumb: ["Employee"],
    previousChunkSnippet:
      '    def update_performance(self, score: float) -> None:\n        """Update employee performance score.\n        \n        Args:\n            score: Performance score (0.0 to 1.0)\n        """\n        if 0.0 <= score <= 1.0:\n            self._performance_score = score\n        else:\n            raise ValueError("Performance score must be between 0.0 and 1.0")',
    nextChunkSnippet: "# Class with decorators and special methods",
  },
  {
    uuid: "321e16bd-ac70-4e98-8261-d5e0940898ed",
    filePath: "/Users/amarssajjanshetty/workfolder5/projectV3/test/test.py",
    startLine: 214,
    endLine: 214,
    code: "# Class with decorators and special methods",
    parentCode:
      '"""\nThis is a comprehensive test file for the code chunker.\nIt contains various Python components to test AST parsing and chunking.\n"""\n',
    breadcrumb: [],
    previousChunkSnippet:
      '    @classmethod\n    def create_manager(cls, name: str, age: int, employee_id: str) -> \'Employee\':\n        """Create a manager employee with default settings."""\n        return cls(\n            name=name,\n            age=age,\n            employee_id=employee_id,\n            department="Management",\n            salary=100000.0\n        )',
    nextChunkSnippet: "class DataProcessor:",
  },
  {
    uuid: "39e3726f-5712-4662-a4b1-40b0cb35b35a",
    filePath: "/Users/amarssajjanshetty/workfolder5/projectV3/test/test.py",
    startLine: 215,
    endLine: 215,
    code: "class DataProcessor:",
    parentCode:
      'class DataProcessor:\n    """Processes data with various operations."""\n    \n    def __init__(self, data: List[any]):\n        """Initialize with data list."""',
    breadcrumb: ["DataProcessor"],
    previousChunkSnippet: "# Class with decorators and special methods",
    nextChunkSnippet:
      '"""Processes data with various operations."""\n    \n    def __init__(self, data: List[any]):\n        """Initialize with data list."""\n        self.data = data\n        self.processed_count = 0\n    \n    def __len__(self) -> int:\n        """Return length of data."""\n        return len(self.data)',
  },
  {
    uuid: "d72951b2-bc3e-48a0-855a-ab486fe6a6b2",
    filePath: "/Users/amarssajjanshetty/workfolder5/projectV3/test/test.py",
    startLine: 216,
    endLine: 260,
    code: '"""Processes data with various operations."""\n    \n    def __init__(self, data: List[any]):\n        """Initialize with data list."""\n        self.data = data\n        self.processed_count = 0\n    \n    def __len__(self) -> int:\n        """Return length of data."""\n        return len(self.data)\n    \n    def __getitem__(self, index: int) -> any:\n        """Get item by index."""\n        return self.data[index]\n    \n    def __str__(self) -> str:\n        """String representation."""\n        return f"DataProcessor with {len(self.data)} items"\n    \n    def __repr__(self) -> str:\n        """Developer representation."""\n        return f"DataProcessor(data={self.data})"\n    \n    @property\n    def is_empty(self) -> bool:\n        """Check if processor has no data."""\n        return len(self.data) == 0\n    \n    def process(self, operation: callable) -> List[any]:\n        """Process all data with given operation."""\n        results = []\n        for item in self.data:\n            try:\n                result = operation(item)\n                results.append(result)\n                self.processed_count += 1\n            except Exception as e:\n                print(f"Error processing item: {e}")\n                continue\n        return results\n    \n    def filter(self, predicate: callable) -> \'DataProcessor\':\n        """Filter data and return new processor."""\n        filtered = [item for item in self.data if predicate(item)]\n        return DataProcessor(filtered)',
    parentCode:
      '"""Processes data with various operations."""\n    \n    def __init__(self, data: List[any]):\n        """Initialize with data list."""\n        self.data = data',
    breadcrumb: ["DataProcessor"],
    previousChunkSnippet: "class DataProcessor:",
    nextChunkSnippet:
      'def map(self, transform: callable) -> \'DataProcessor\':\n        """Transform data and return new processor."""\n        transformed = [transform(item) for item in self.data]\n        return DataProcessor(transformed)',
  },
  {
    uuid: "955e8613-18a5-4eca-a418-90dcb3841b73",
    filePath: "/Users/amarssajjanshetty/workfolder5/projectV3/test/test.py",
    startLine: 262,
    endLine: 265,
    code: 'def map(self, transform: callable) -> \'DataProcessor\':\n        """Transform data and return new processor."""\n        transformed = [transform(item) for item in self.data]\n        return DataProcessor(transformed)',
    parentCode:
      '"""Processes data with various operations."""\n    \n    def __init__(self, data: List[any]):\n        """Initialize with data list."""\n        self.data = data',
    breadcrumb: ["DataProcessor"],
    previousChunkSnippet:
      '                self.processed_count += 1\n            except Exception as e:\n                print(f"Error processing item: {e}")\n                continue\n        return results\n    \n    def filter(self, predicate: callable) -> \'DataProcessor\':\n        """Filter data and return new processor."""\n        filtered = [item for item in self.data if predicate(item)]\n        return DataProcessor(filtered)',
    nextChunkSnippet:
      '# Nested class example\nclass OuterClass:\n    """Outer class containing nested class."""\n    \n    class InnerClass:\n        """Nested inner class."""\n        \n        def __init__(self, value: int):\n            """Initialize inner class."""\n            self.value = value',
  },
  {
    uuid: "dae3b1c6-c14a-485a-b59c-a4a40bb773c4",
    filePath: "/Users/amarssajjanshetty/workfolder5/projectV3/test/test.py",
    startLine: 268,
    endLine: 321,
    code: '# Nested class example\nclass OuterClass:\n    """Outer class containing nested class."""\n    \n    class InnerClass:\n        """Nested inner class."""\n        \n        def __init__(self, value: int):\n            """Initialize inner class."""\n            self.value = value\n        \n        def get_value(self) -> int:\n            """Get inner value."""\n            return self.value\n    \n    def __init__(self):\n        """Initialize outer class."""\n        self.inner = OuterClass.InnerClass(42)\n\n\n# Function with lambda and comprehensions\ndef advanced_python_features(numbers: List[int]) -> Dict[str, List[int]]:\n    """Demonstrate advanced Python features."""\n    \n    # List comprehension\n    evens = [n for n in numbers if n % 2 == 0]\n    \n    # Dictionary comprehension\n    squares = {n: n**2 for n in numbers}\n    \n    # Set comprehension\n    unique = {n % 10 for n in numbers}\n    \n    # Lambda functions\n    doubled = list(map(lambda x: x * 2, numbers))\n    \n    # Filter with lambda\n    filtered = list(filter(lambda x: x > 10, numbers))\n    \n    # Generator expression\n    generator = (n * 3 for n in numbers if n > 5)\n    generated = list(generator)\n    \n    return {\n        "evens": evens,\n        "squares_keys": list(squares.keys()),\n        "unique_remainders": list(unique),\n        "doubled": doubled,\n        "filtered": filtered,\n        "generated": generated\n    }\n\n\n# Async function example',
    parentCode:
      '"""\nThis is a comprehensive test file for the code chunker.\nIt contains various Python components to test AST parsing and chunking.\n"""\n',
    breadcrumb: [],
    previousChunkSnippet:
      'def map(self, transform: callable) -> \'DataProcessor\':\n        """Transform data and return new processor."""\n        transformed = [transform(item) for item in self.data]\n        return DataProcessor(transformed)',
    nextChunkSnippet:
      'async def async_function(url: str) -> Dict[str, any]:\n    """Async function to fetch data."""\n    import aiohttp\n    \n    async with aiohttp.ClientSession() as session:\n        async with session.get(url) as response:\n            data = await response.json()\n            return data\n\n',
  },
  {
    uuid: "205cd96f-a02b-4b27-b789-c97c2e47fc07",
    filePath: "/Users/amarssajjanshetty/workfolder5/projectV3/test/test.py",
    startLine: 322,
    endLine: 354,
    code: 'async def async_function(url: str) -> Dict[str, any]:\n    """Async function to fetch data."""\n    import aiohttp\n    \n    async with aiohttp.ClientSession() as session:\n        async with session.get(url) as response:\n            data = await response.json()\n            return data\n\n\n# Context manager example\nclass FileHandler:\n    """Context manager for file operations."""\n    \n    def __init__(self, filename: str, mode: str = \'r\'):\n        """Initialize file handler."""\n        self.filename = filename\n        self.mode = mode\n        self.file = None\n    \n    def __enter__(self):\n        """Enter context manager."""\n        self.file = open(self.filename, self.mode)\n        return self.file\n    \n    def __exit__(self, exc_type, exc_val, exc_tb):\n        """Exit context manager."""\n        if self.file:\n            self.file.close()\n        return False\n\n\n# Main execution block',
    parentCode:
      '"""\nThis is a comprehensive test file for the code chunker.\nIt contains various Python components to test AST parsing and chunking.\n"""\n',
    breadcrumb: [],
    previousChunkSnippet:
      '        "evens": evens,\n        "squares_keys": list(squares.keys()),\n        "unique_remainders": list(unique),\n        "doubled": doubled,\n        "filtered": filtered,\n        "generated": generated\n    }\n\n\n# Async function example',
    nextChunkSnippet:
      'if __name__ == "__main__":\n    # Test simple function\n    result = simple_function(5, 3)\n    print(f"Simple function result: {result}")\n    \n    # Test class instantiation\n    person = Person("Alice", 25, "alice@example.com")\n    print(person.greet())\n    print(f"Is adult: {person.is_adult}")\n    ',
  },
  {
    uuid: "a1f977eb-87f7-4bb9-ae19-1564ff4155a9",
    filePath: "/Users/amarssajjanshetty/workfolder5/projectV3/test/test.py",
    startLine: 355,
    endLine: 386,
    code: 'if __name__ == "__main__":\n    # Test simple function\n    result = simple_function(5, 3)\n    print(f"Simple function result: {result}")\n    \n    # Test class instantiation\n    person = Person("Alice", 25, "alice@example.com")\n    print(person.greet())\n    print(f"Is adult: {person.is_adult}")\n    \n    # Test employee class\n    employee = Employee(\n        name="Bob",\n        age=30,\n        employee_id="EMP001",\n        department="Engineering",\n        salary=75000.0\n    )\n    print(f"Employee: {employee.greet()}")\n    print(f"Bonus: ${employee.calculate_bonus():.2f}")\n    \n    # Test data processor\n    processor = DataProcessor([1, 2, 3, 4, 5])\n    doubled = processor.map(lambda x: x * 2)\n    print(f"Doubled data: {doubled.data}")\n    \n    # Test advanced features\n    numbers = [1, 2, 3, 4, 5, 15, 20, 25]\n    features = advanced_python_features(numbers)\n    print(f"Advanced features: {features}")\n    \n    print("All tests completed successfully!")',
    parentCode:
      '"""\nThis is a comprehensive test file for the code chunker.\nIt contains various Python components to test AST parsing and chunking.\n"""\n',
    breadcrumb: [],
    previousChunkSnippet:
      '        return self.file\n    \n    def __exit__(self, exc_type, exc_val, exc_tb):\n        """Exit context manager."""\n        if self.file:\n            self.file.close()\n        return False\n\n\n# Main execution block',
  })
]

[
  ({
    uuid: "d59f0c93-3994-490c-b609-c19dc4f98831",
    filePath: "/Users/amarssajjanshetty/workfolder5/projectV3/test/test.ts",
    startLine: 1,
    endLine: 59,
    code: '/**\n * Comprehensive TypeScript test file for the code chunker.\n * This file contains various TypeScript components to test AST parsing and chunking.\n */\n\n// Standard library imports\n// eslint-disable-next-line @typescript-eslint/no-unused-vars\nimport { EventEmitter } from "events";\n\n// Simple UUID generator for testing\nfunction generateId(): string {\n  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;\n}\n\n// Type definitions\ntype UserRole = "admin" | "user" | "guest";\ntype Status = "active" | "inactive" | "pending";\n\n// Interface definitions\ninterface BaseEntity {\n  id: string;\n  createdAt: Date;\n  updatedAt: Date;\n}\n\ninterface User extends BaseEntity {\n  name: string;\n  email: string;\n  role: UserRole;\n  status: Status;\n  metadata?: Record<string, unknown>;\n}\n\ninterface Product extends BaseEntity {\n  name: string;\n  price: number;\n  description: string;\n  category: string;\n  inStock: boolean;\n}\n\n// Generic interface\ninterface Repository<T extends BaseEntity> {\n  findById(id: string): Promise<T | null>;\n  findAll(): Promise<T[]>;\n  create(entity: Omit<T, "id" | "createdAt" | "updatedAt">): Promise<T>;\n  update(id: string, entity: Partial<T>): Promise<T>;\n  delete(id: string): Promise<boolean>;\n}\n\n// Type aliases\ntype ID = string | number;\ntype Callback<T> = (data: T) => void;\ntype AsyncFunction<T, R> = (input: T) => Promise<R>;\n\n// Module-level constants\nconst API_BASE_URL = "https://api.example.com";\n// eslint-disable-next-line @typescript-eslint/no-unused-vars\nconst MAX_RETRIES = 3;',
    parentCode:
      "/**\n * Comprehensive TypeScript test file for the code chunker.\n * This file contains various TypeScript components to test AST parsing and chunking.\n */\n",
    breadcrumb: [],
    nextChunkSnippet:
      "// eslint-disable-next-line @typescript-eslint/no-unused-vars\nconst DEFAULT_TIMEOUT = 30000;\n\n// Module-level variables\n// eslint-disable-next-line @typescript-eslint/no-unused-vars\nconst globalCounter = 0;\nconst appConfig: Record<string, unknown> = {};\n\n// Simple function\nfunction add(a: number, b: number): number {",
  },
  {
    uuid: "f58b21cd-9d9d-4b07-a5d9-6cab8dfea8d6",
    filePath: "/Users/amarssajjanshetty/workfolder5/projectV3/test/test.ts",
    startLine: 60,
    endLine: 106,
    code: '// eslint-disable-next-line @typescript-eslint/no-unused-vars\nconst DEFAULT_TIMEOUT = 30000;\n\n// Module-level variables\n// eslint-disable-next-line @typescript-eslint/no-unused-vars\nconst globalCounter = 0;\nconst appConfig: Record<string, unknown> = {};\n\n// Simple function\nfunction add(a: number, b: number): number {\n  return a + b;\n}\n\n// Function with default parameters\nfunction greet(name: string = "Guest", age: number = 18): string {\n  return `Hello, ${name}! You are ${age} years old.`;\n}\n\n// Generic function\nfunction identity<T>(value: T): T {\n  return value;\n}\n\n// Function with overloads\nfunction processData(input: string): string;\nfunction processData(input: number): number;\nfunction processData(input: string | number): string | number {\n  if (typeof input === "string") {\n    return input.toUpperCase();\n  }\n  return input * 2;\n}\n\n// Complex function with generics and type constraints\nfunction transformArray<T, R>(\n  items: T[],\n  transformer: (item: T) => R,\n  filter?: (item: T) => boolean\n): R[] {\n  let filtered = items;\n  if (filter) {\n    filtered = items.filter(filter);\n  }\n  return filtered.map(transformer);\n}\n\n// Async function',
    parentCode:
      "/**\n * Comprehensive TypeScript test file for the code chunker.\n * This file contains various TypeScript components to test AST parsing and chunking.\n */\n",
    breadcrumb: [],
    previousChunkSnippet:
      '\n// Type aliases\ntype ID = string | number;\ntype Callback<T> = (data: T) => void;\ntype AsyncFunction<T, R> = (input: T) => Promise<R>;\n\n// Module-level constants\nconst API_BASE_URL = "https://api.example.com";\n// eslint-disable-next-line @typescript-eslint/no-unused-vars\nconst MAX_RETRIES = 3;',
    nextChunkSnippet:
      "async function fetchUserData(userId: string): Promise<User> {\n  try {\n    // Simulated API call - in real scenario would use fetch or axios\n    const response = await fetch(`${API_BASE_URL}/users/${userId}`);\n    if (!response.ok) {\n      throw new Error(`HTTP error! status: ${response.status}`);\n    }\n    const data = (await response.json()) as User;\n    return data;\n  } catch (error) {",
  },
  {
    uuid: "df6af9f7-2c12-4dbd-b7cf-f2ea6c2a7990",
    filePath: "/Users/amarssajjanshetty/workfolder5/projectV3/test/test.ts",
    startLine: 107,
    endLine: 136,
    code: "async function fetchUserData(userId: string): Promise<User> {\n  try {\n    // Simulated API call - in real scenario would use fetch or axios\n    const response = await fetch(`${API_BASE_URL}/users/${userId}`);\n    if (!response.ok) {\n      throw new Error(`HTTP error! status: ${response.status}`);\n    }\n    const data = (await response.json()) as User;\n    return data;\n  } catch (error) {\n    throw new Error(`Failed to fetch user: ${error}`);\n  }\n}\n\n// Function with rest parameters\nfunction sum(...numbers: number[]): number {\n  return numbers.reduce((acc, num) => acc + num, 0);\n}\n\n// Arrow function\nconst multiply = (a: number, b: number): number => a * b;\n\n// Higher-order function\nfunction createLogger(prefix: string): (message: string) => void {\n  return (message: string) => {\n    console.log(`[${prefix}] ${message}`);\n  };\n}\n\n// Simple class",
    parentCode:
      "/**\n * Comprehensive TypeScript test file for the code chunker.\n * This file contains various TypeScript components to test AST parsing and chunking.\n */\n",
    breadcrumb: [],
    previousChunkSnippet:
      "  filter?: (item: T) => boolean\n): R[] {\n  let filtered = items;\n  if (filter) {\n    filtered = items.filter(filter);\n  }\n  return filtered.map(transformer);\n}\n\n// Async function",
    nextChunkSnippet:
      "class Person {\n  // Class properties\n  private _age: number;\n  protected name: string;\n  public readonly id: string;\n\n  // Constructor\n  constructor(name: string, age: number) {\n    this.name = name;\n    this._age = age;",
  },
  {
    uuid: "901715f9-f3b5-42cd-9b52-421fd7c349b5",
    filePath: "/Users/amarssajjanshetty/workfolder5/projectV3/test/test.ts",
    startLine: 137,
    endLine: 179,
    code: "class Person {\n  // Class properties\n  private _age: number;\n  protected name: string;\n  public readonly id: string;\n\n  // Constructor\n  constructor(name: string, age: number) {\n    this.name = name;\n    this._age = age;\n    this.id = generateId();\n  }\n\n  // Getter\n  get age(): number {\n    return this._age;\n  }\n\n  // Setter\n  set age(value: number) {\n    if (value >= 0) {\n      this._age = value;\n    }\n  }\n\n  // Method\n  greet(): string {\n    return `Hello, I'm ${this.name} and I'm ${this._age} years old`;\n  }\n\n  // Static method\n  static fromJSON(json: string): Person {\n    const data = JSON.parse(json);\n    return new Person(data.name, data.age);\n  }\n\n  // Private method\n  private validateAge(): boolean {\n    return this._age >= 0 && this._age <= 150;\n  }\n}\n\n// Class with inheritance",
    parentCode:
      "/**\n * Comprehensive TypeScript test file for the code chunker.\n * This file contains various TypeScript components to test AST parsing and chunking.\n */\n",
    breadcrumb: [],
    previousChunkSnippet:
      "const multiply = (a: number, b: number): number => a * b;\n\n// Higher-order function\nfunction createLogger(prefix: string): (message: string) => void {\n  return (message: string) => {\n    console.log(`[${prefix}] ${message}`);\n  };\n}\n\n// Simple class",
    nextChunkSnippet:
      "class Employee extends Person {\n  private employeeId: string;\n  public department: string;\n  protected salary: number;\n\n  constructor(\n    name: string,\n    age: number,\n    employeeId: string,\n    department: string,",
  },
  {
    uuid: "c99ecbe7-3522-4c7a-af2b-a86e44ae9ba6",
    filePath: "/Users/amarssajjanshetty/workfolder5/projectV3/test/test.ts",
    startLine: 180,
    endLine: 252,
    code: "class Employee extends Person {\n  private employeeId: string;\n  public department: string;\n  protected salary: number;\n\n  constructor(\n    name: string,\n    age: number,\n    employeeId: string,\n    department: string,\n    salary: number\n  ) {\n    super(name, age);\n    this.employeeId = employeeId;\n    this.department = department;\n    this.salary = salary;\n  }\n\n  // Override method\n  greet(): string {\n    return `${super.greet()} and I work in ${this.department}`;\n  }\n\n  // New method\n  calculateBonus(multiplier: number = 0.1): number {\n    return this.salary * multiplier;\n  }\n\n  // Protected method\n  protected updateSalary(newSalary: number): void {\n    if (newSalary > 0) {\n      this.salary = newSalary;\n    }\n  }\n\n  // Abstract-like pattern with interface\n  getInfo(): Record<string, unknown> {\n    return {\n      name: this.name,\n      age: this.age,\n      employeeId: this.employeeId,\n      department: this.department,\n      salary: this.salary,\n    };\n  }\n}\n\n// Generic class\nclass Stack<T> {\n  private items: T[] = [];\n\n  push(item: T): void {\n    this.items.push(item);\n  }\n\n  pop(): T | undefined {\n    return this.items.pop();\n  }\n\n  peek(): T | undefined {\n    return this.items[this.items.length - 1];\n  }\n\n  isEmpty(): boolean {\n    return this.items.length === 0;\n  }\n\n  size(): number {\n    return this.items.length;\n  }\n}\n\n// Class implementing interface",
    parentCode:
      "/**\n * Comprehensive TypeScript test file for the code chunker.\n * This file contains various TypeScript components to test AST parsing and chunking.\n */\n",
    breadcrumb: [],
    previousChunkSnippet:
      "    return new Person(data.name, data.age);\n  }\n\n  // Private method\n  private validateAge(): boolean {\n    return this._age >= 0 && this._age <= 150;\n  }\n}\n\n// Class with inheritance",
    nextChunkSnippet:
      "class UserRepository implements Repository<User> {\n  private users: Map<string, User> = new Map();\n\n  async findById(id: string): Promise<User | null> {\n    return this.users.get(id) || null;\n  }\n\n  async findAll(): Promise<User[]> {\n    return Array.from(this.users.values());\n  }",
  },
  {
    uuid: "ec796c17-88cb-40f5-8cbc-9e7c600b2fc9",
    filePath: "/Users/amarssajjanshetty/workfolder5/projectV3/test/test.ts",
    startLine: 253,
    endLine: 311,
    code: 'class UserRepository implements Repository<User> {\n  private users: Map<string, User> = new Map();\n\n  async findById(id: string): Promise<User | null> {\n    return this.users.get(id) || null;\n  }\n\n  async findAll(): Promise<User[]> {\n    return Array.from(this.users.values());\n  }\n\n  async create(\n    entity: Omit<User, "id" | "createdAt" | "updatedAt">\n  ): Promise<User> {\n    const user: User = {\n      ...entity,\n      id: generateId(),\n      createdAt: new Date(),\n      updatedAt: new Date(),\n    };\n    this.users.set(user.id, user);\n    return user;\n  }\n\n  async update(id: string, entity: Partial<User>): Promise<User> {\n    const existing = await this.findById(id);\n    if (!existing) {\n      throw new Error(`User with id ${id} not found`);\n    }\n    const updated: User = {\n      ...existing,\n      ...entity,\n      updatedAt: new Date(),\n    };\n    this.users.set(id, updated);\n    return updated;\n  }\n\n  async delete(id: string): Promise<boolean> {\n    return this.users.delete(id);\n  }\n}\n\n// Abstract class\nabstract class BaseService {\n  protected logger: (message: string) => void;\n\n  constructor(serviceName: string) {\n    this.logger = createLogger(serviceName);\n  }\n\n  abstract process(data: unknown): Promise<unknown>;\n\n  protected log(message: string): void {\n    this.logger(message);\n  }\n}\n\n// Concrete implementation',
    parentCode:
      "/**\n * Comprehensive TypeScript test file for the code chunker.\n * This file contains various TypeScript components to test AST parsing and chunking.\n */\n",
    breadcrumb: [],
    previousChunkSnippet:
      "  isEmpty(): boolean {\n    return this.items.length === 0;\n  }\n\n  size(): number {\n    return this.items.length;\n  }\n}\n\n// Class implementing interface",
    nextChunkSnippet:
      'class UserService extends BaseService {\n  private repository: UserRepository;\n\n  constructor() {\n    super("UserService");\n    this.repository = new UserRepository();\n  }\n\n  async process(data: unknown): Promise<User> {\n    this.log("Processing user data");',
  },
  {
    uuid: "e56f3302-8fb9-405d-91fc-16ecba9ca2a8",
    filePath: "/Users/amarssajjanshetty/workfolder5/projectV3/test/test.ts",
    startLine: 312,
    endLine: 376,
    code: 'class UserService extends BaseService {\n  private repository: UserRepository;\n\n  constructor() {\n    super("UserService");\n    this.repository = new UserRepository();\n  }\n\n  async process(data: unknown): Promise<User> {\n    this.log("Processing user data");\n    if (typeof data === "object" && data !== null) {\n      return await this.repository.create(data as Omit<User, "id" | "createdAt" | "updatedAt">);\n    }\n    throw new Error("Invalid user data");\n  }\n\n  async getUser(id: string): Promise<User | null> {\n    return await this.repository.findById(id);\n  }\n}\n\n// Enum\nenum Color {\n  Red = "RED",\n  Green = "GREEN",\n  Blue = "BLUE",\n}\n\nenum StatusCode {\n  OK = 200,\n  NotFound = 404,\n  ServerError = 500,\n}\n\n// Namespace\nnamespace Utils {\n  export function formatDate(date: Date): string {\n    return date.toISOString();\n  }\n\n  export function parseJSON<T>(json: string): T {\n    return JSON.parse(json) as T;\n  }\n\n  export class Formatter {\n    static formatCurrency(amount: number): string {\n      return `$${amount.toFixed(2)}`;\n    }\n  }\n}\n\n// Decorator function (simple implementation)\nfunction logMethod(\n  target: unknown,\n  propertyKey: string,\n  descriptor: PropertyDescriptor\n): void {\n  const originalMethod = descriptor.value;\n  descriptor.value = function (...args: unknown[]) {\n    console.log(`Calling ${propertyKey} with args:`, args);\n    return originalMethod.apply(this, args);\n  };\n}\n\n// Class with decorator',
    parentCode:
      "/**\n * Comprehensive TypeScript test file for the code chunker.\n * This file contains various TypeScript components to test AST parsing and chunking.\n */\n",
    breadcrumb: [],
    previousChunkSnippet:
      "  }\n\n  abstract process(data: unknown): Promise<unknown>;\n\n  protected log(message: string): void {\n    this.logger(message);\n  }\n}\n\n// Concrete implementation",
    nextChunkSnippet:
      "class Calculator {\n  @logMethod\n  add(a: number, b: number): number {\n    return a + b;\n  }\n\n  @logMethod\n  subtract(a: number, b: number): number {\n    return a - b;\n  }",
  },
  {
    uuid: "d14b4214-50ae-42f7-ae64-faae5dcbc446",
    filePath: "/Users/amarssajjanshetty/workfolder5/projectV3/test/test.ts",
    startLine: 377,
    endLine: 442,
    code: 'class Calculator {\n  @logMethod\n  add(a: number, b: number): number {\n    return a + b;\n  }\n\n  @logMethod\n  subtract(a: number, b: number): number {\n    return a - b;\n  }\n}\n\n// Type guards\nfunction isUser(obj: unknown): obj is User {\n  return (\n    typeof obj === "object" &&\n    obj !== null &&\n    "id" in obj &&\n    "name" in obj &&\n    "email" in obj\n  );\n}\n\n// Assertion function\nfunction assertIsString(value: unknown): asserts value is string {\n  if (typeof value !== "string") {\n    throw new Error("Value is not a string");\n  }\n}\n\n// Conditional types\ntype NonNullable<T> = T extends null | undefined ? never : T;\ntype ReturnType<T> = T extends (...args: unknown[]) => infer R ? R : never;\n\n// Mapped types\ntype Readonly<T> = {\n  readonly [P in keyof T]: T[P];\n};\n\ntype Partial<T> = {\n  [P in keyof T]?: T[P];\n};\n\n// Utility types usage\ntype UserInput = Omit<User, "id" | "createdAt" | "updatedAt">;\ntype UserUpdate = Partial<Pick<User, "name" | "email" | "status">>;\n\n// Async generator\nasync function* asyncGenerator(start: number, end: number): AsyncGenerator<number> {\n  for (let i = start; i <= end; i++) {\n    await new Promise((resolve) => setTimeout(resolve, 100));\n    yield i;\n  }\n}\n\n// Regular generator\nfunction* numberGenerator(start: number, end: number): Generator<number> {\n  for (let i = start; i <= end; i++) {\n    yield i;\n  }\n}\n\n// Function with destructuring\nfunction processUser({ name, email, role }: User): string {\n  return `${name} (${email}) - ${role}`;\n}',
    parentCode:
      "/**\n * Comprehensive TypeScript test file for the code chunker.\n * This file contains various TypeScript components to test AST parsing and chunking.\n */\n",
    breadcrumb: [],
    previousChunkSnippet:
      "  descriptor: PropertyDescriptor\n): void {\n  const originalMethod = descriptor.value;\n  descriptor.value = function (...args: unknown[]) {\n    console.log(`Calling ${propertyKey} with args:`, args);\n    return originalMethod.apply(this, args);\n  };\n}\n\n// Class with decorator",
    nextChunkSnippet:
      '// Function with optional chaining and nullish coalescing\nfunction getUserName(user: User | null | undefined): string {\n  return user?.name ?? "Unknown";\n}\n\n// Template literal types\ntype EventName = `on${Capitalize<string>}`;\ntype CSSValue = `${number}px` | `${number}%` | "auto";\n\n// Const assertions',
  },
  {
    uuid: "95a490bd-e3a1-40fa-b53f-db48d49e5364",
    filePath: "/Users/amarssajjanshetty/workfolder5/projectV3/test/test.ts",
    startLine: 444,
    endLine: 468,
    code: '// Function with optional chaining and nullish coalescing\nfunction getUserName(user: User | null | undefined): string {\n  return user?.name ?? "Unknown";\n}\n\n// Template literal types\ntype EventName = `on${Capitalize<string>}`;\ntype CSSValue = `${number}px` | `${number}%` | "auto";\n\n// Const assertions\nconst config = {\n  apiUrl: "https://api.example.com",\n  timeout: 30000,\n  retries: 3,\n} as const;\n\n// Tuple types\ntype Point = [number, number];\ntype UserTuple = [string, string, number]; // [name, email, age]\n\n// Union and intersection types\ntype StringOrNumber = string | number;\ntype UserWithProduct = User & { product: Product };\n\n// Main execution',
    parentCode:
      "/**\n * Comprehensive TypeScript test file for the code chunker.\n * This file contains various TypeScript components to test AST parsing and chunking.\n */\n",
    breadcrumb: [],
    previousChunkSnippet:
      "function* numberGenerator(start: number, end: number): Generator<number> {\n  for (let i = start; i <= end; i++) {\n    yield i;\n  }\n}\n\n// Function with destructuring\nfunction processUser({ name, email, role }: User): string {\n  return `${name} (${email}) - ${role}`;\n}",
    nextChunkSnippet:
      'async function main(): Promise<void> {\n  console.log("TypeScript Chunker Test");\n\n  // Test simple function\n  const result = add(5, 3);\n  console.log(`Add result: ${result}`);\n\n  // Test class\n  const person = new Person("Alice", 25);\n  console.log(person.greet());',
  },
  {
    uuid: "605fbc90-a0d9-4c3f-8151-5d20abc4aff2",
    filePath: "/Users/amarssajjanshetty/workfolder5/projectV3/test/test.ts",
    startLine: 469,
    endLine: 523,
    code: 'async function main(): Promise<void> {\n  console.log("TypeScript Chunker Test");\n\n  // Test simple function\n  const result = add(5, 3);\n  console.log(`Add result: ${result}`);\n\n  // Test class\n  const person = new Person("Alice", 25);\n  console.log(person.greet());\n\n  // Test employee\n  const employee = new Employee("Bob", 30, "EMP001", "Engineering", 75000);\n  console.log(employee.greet());\n  console.log(`Bonus: $${employee.calculateBonus()}`);\n\n  // Test generic class\n  const stack = new Stack<number>();\n  stack.push(1);\n  stack.push(2);\n  stack.push(3);\n  console.log(`Stack size: ${stack.size()}`);\n\n  // Test repository\n  const userRepo = new UserRepository();\n  const user = await userRepo.create({\n    name: "Charlie",\n    email: "charlie@example.com",\n    role: "user",\n    status: "active",\n  });\n  console.log(`Created user: ${user.name}`);\n\n  // Test service\n  const userService = new UserService();\n  const serviceUser = await userService.process({\n    name: "David",\n    email: "david@example.com",\n    role: "admin",\n    status: "active",\n  });\n  console.log(`Service user: ${serviceUser.name}`);\n\n  // Test utilities\n  const formatted = Utils.Formatter.formatCurrency(1234.56);\n  console.log(`Formatted: ${formatted}`);\n\n  // Test calculator with decorator\n  const calc = new Calculator();\n  console.log(`5 + 3 = ${calc.add(5, 3)}`);\n\n  console.log("All tests completed!");\n}\n\n// Export statements',
    parentCode:
      "/**\n * Comprehensive TypeScript test file for the code chunker.\n * This file contains various TypeScript components to test AST parsing and chunking.\n */\n",
    breadcrumb: [],
    previousChunkSnippet:
      "\n// Tuple types\ntype Point = [number, number];\ntype UserTuple = [string, string, number]; // [name, email, age]\n\n// Union and intersection types\ntype StringOrNumber = string | number;\ntype UserWithProduct = User & { product: Product };\n\n// Main execution",
    nextChunkSnippet:
      "export {\n  User,\n  Product,\n  Person,\n  Employee,\n  UserRepository,\n  UserService,\n  Stack,\n  add,\n  greet,",
  },
  {
    uuid: "31c2047d-9121-4d27-9312-53f78484cf8e",
    filePath: "/Users/amarssajjanshetty/workfolder5/projectV3/test/test.ts",
    startLine: 524,
    endLine: 545,
    code: "export {\n  User,\n  Product,\n  Person,\n  Employee,\n  UserRepository,\n  UserService,\n  Stack,\n  add,\n  greet,\n  fetchUserData,\n  transformArray,\n};\n\n// Default export\nexport default main;\n++ some here code \n// Conditional execution\nif (require.main ==== module) {\n  main().catch(console.error);\n}\n}",
    parentCode:
      "/**\n * Comprehensive TypeScript test file for the code chunker.\n * This file contains various TypeScript components to test AST parsing and chunking.\n */\n",
    breadcrumb: [],
    error: [
      "error: Has error at line number 540 at node or some here",
      "error: Has error at line number 542 at node or =",
      "error: Has error at line number 545 at node or }",
    ],
    previousChunkSnippet:
      '  console.log(`Formatted: ${formatted}`);\n\n  // Test calculator with decorator\n  const calc = new Calculator();\n  console.log(`5 + 3 = ${calc.add(5, 3)}`);\n\n  console.log("All tests completed!");\n}\n\n// Export statements',
  })
]
