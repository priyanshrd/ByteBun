import os
import re

# Specify the directory where your code files are located
directory_path = "C:/Restaurant_Manager/frontend"

# Function to replace 'tomato' with '#5474b4' in a file
def replace_in_file(file_path):
    with open(file_path, 'r') as file:
        content = file.read()
    
    # Replace 'tomato' with '#5474b4'
    new_content = re.sub(r'\btomato\b', '#5474b4', content)
    
    # Write the new content back to the file
    with open(file_path, 'w') as file:
        file.write(new_content)

# Walk through the directory and process each file
for root, dirs, files in os.walk(directory_path):
    for file in files:
        if file.endswith('.css'):  # Adjust this if you need other file types
            file_path = os.path.join(root, file)
            replace_in_file(file_path)

print("All instances of 'tomato' have been replaced with '#5474b4'.")
