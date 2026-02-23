import os

def show_tree(start_path, prefix=""):
    files = sorted(os.listdir(start_path))
    for i, name in enumerate(files):
        path = os.path.join(start_path, name)
        connector = "└── " if i == len(files) - 1 else "├── "
        print(prefix + connector + name)
        if os.path.isdir(path):
            extension = "    " if i == len(files) - 1 else "│   "
            show_tree(path, prefix + extension)

if __name__ == "__main__":
    project_root = os.getcwd()
    print(f"Project root: {project_root}\n")
    show_tree(project_root)