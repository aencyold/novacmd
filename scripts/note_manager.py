import os
import re

NOTES_DIR = "notes/"
FILE_EXTENSION = ".notes.novacmd.any"

if not os.path.exists(NOTES_DIR):
    os.makedirs(NOTES_DIR)
=======
NOTES_DIR = "notes/"
FILE_EXTENSION = ".notes.novacmd.any"

def remove_duplicates():
    """Identifica e remove notas duplicadas."""
    notes = {}
    for filename in os.listdir(NOTES_DIR):
        if filename.endswith(FILE_EXTENSION):
            filepath = os.path.join(NOTES_DIR, filename)
            try:
                with open(filepath, "r") as f:
                    content = f.read()
                    if content in notes:
                        print(f"Nota duplicada encontrada: {filename} e {notes[content]}")
                        # Remover a nota duplicada
                        os.remove(filepath)
                        print(f"Nota duplicada removida: {filename}")
                    else:
                        notes[content] = filename
            except Exception as e:
                print(f"Erro ao ler o arquivo {filename}: {e}")

def create_note():
    """Cria uma nova nota."""
    while True:
        filename = input("Digite o nome da nota (sem extensão): ")
        filepath = os.path.join(NOTES_DIR, filename + FILE_EXTENSION)
        if os.path.exists(filepath):
            overwrite = input("O arquivo já existe. Deseja sobrescrever? (s/n): ")
            if overwrite.lower() == "s":
                break
            else:
                continue
        else:
            break

    content = input("Digite o conteúdo da nota: ")
    try:
        os.makedirs(NOTES_DIR, exist_ok=True)
        with open(filepath, "w") as f:
            f.write(content)
        print(f"Nota '{filename}' criada com sucesso.")
    except Exception as e:
        print(f"Erro ao criar a nota: {e}")

def edit_note():
    """Edita uma nota existente."""
    filenames = [f for f in os.listdir(NOTES_DIR) if f.endswith(FILE_EXTENSION)]
    if not filenames:
        print("Nenhuma nota encontrada.")
        return

    print("Notas disponíveis:")
    for i, filename in enumerate(filenames):
        print(f"{i+1}. {filename}")

    while True:
        try:
            choice = int(input("Selecione o número da nota para editar: "))
            if 1 <= choice <= len(filenames):
                break
            else:
                print("Número inválido.")
        except ValueError:
            print("Entrada inválida. Digite um número.")

    selected_filename = filenames[choice - 1]
    filepath = os.path.join(NOTES_DIR, selected_filename)
    try:
        with open(filepath, "r") as f:
            content = f.read()
        print("Conteúdo atual:")
        print(content)
        new_content = input("Digite o novo conteúdo da nota (deixe em branco para manter o conteúdo atual): ")
        if new_content:
            with open(filepath, "w") as f:
                f.write(new_content)
            print(f"Nota '{selected_filename}' editada com sucesso.")
        else:
            print("Edição cancelada.")
    except Exception as e:
        print(f"Erro ao editar a nota: {e}")

def delete_note():
    """Remove uma nota."""
    filenames = [f for f in os.listdir(NOTES_DIR) if f.endswith(FILE_EXTENSION)]
    if not filenames:
        print("Nenhuma nota encontrada.")
        return

    print("Notas disponíveis:")
    for i, filename in enumerate(filenames):
        print(f"{i+1}. {filename}")

    while True:
        try:
            choice = int(input("Selecione o número da nota para remover: "))
            if 1 <= choice <= len(filenames):
                break
            else:
                print("Número inválido.")
        except ValueError:
            print("Entrada inválida. Digite um número.")

    selected_filename = filenames[choice - 1]
    filepath = os.path.join(NOTES_DIR, selected_filename)
    confirm = input(f"Tem certeza que deseja remover a nota '{selected_filename}'? (s/n): ")
    if confirm.lower() == "s":
        try:
            os.remove(filepath)
            print(f"Nota '{selected_filename}' removida com sucesso.")
        except Exception as e:
            print(f"Erro ao remover a nota: {e}")
    else:
        print("Remoção cancelada.")

def search_notes():
    """Busca por palavras-chave nas notas."""
    keyword = input("Digite a palavra-chave para buscar: ")
    filenames = [f for f in os.listdir(NOTES_DIR) if f.endswith(FILE_EXTENSION)]
    if not filenames:
        print("Nenhuma nota encontrada.")
        return

    found_notes = []
    for filename in filenames:
        filepath = os.path.join(NOTES_DIR, filename)
        try:
            with open(filepath, "r") as f:
                content = f.read()
                if keyword.lower() in content.lower():
                    found_notes.append(filename)
        except Exception as e:
            print(f"Erro ao ler o arquivo {filename}: {e}")

    if found_notes:
        print("Notas encontradas:")
        for filename in found_notes:
            print(f"- {filename}")
    else:
        print("Nenhuma nota encontrada com a palavra-chave.")

def search_notes_by_category():
    """Busca notas por categoria."""
    category = input("Digite a categoria para buscar: ")
    filenames = [f for f in os.listdir(NOTES_DIR) if f.endswith(FILE_EXTENSION)]
    if not filenames:
        print("Nenhuma nota encontrada.")
        return

    found_notes = []
    for filename in filenames:
        filepath = os.path.join(NOTES_DIR, filename)
        try:
            with open(filepath, "r") as f:
                content = f.read()
                if category.lower() in content.lower():
                    found_notes.append(filename)
        except Exception as e:
            print(f"Erro ao ler o arquivo {filename}: {e}")

    if found_notes:
        print("Notas encontradas:")
        for filename in found_notes:
            print(f"- {filename}")
    else:
        print("Nenhuma nota encontrada com a categoria.")

def main():
    """Função principal do script."""
    while True:
        print("\nGerenciador de Notas")
        print("1. Remover duplicatas")
        print("2. Criar nota")
        print("3. Editar nota")
        print("4. Remover nota")
        print("5. Buscar notas por palavra-chave")
        print("6. Buscar notas por categoria")
        print("7. Sair")

        choice = input("Escolha uma opção: ")

        if choice == "1":
            remove_duplicates()
        elif choice == "2":
            create_note()
        elif choice == "3":
            edit_note()
        elif choice == "4":
            delete_note()
        elif choice == "5":
            search_notes()
        elif choice == "6":
            search_notes_by_category()
        elif choice == "7":
            print("Saindo...")
            break
        else:
            print("Opção inválida. Tente novamente.")

if __name__ == "__main__":
    main()