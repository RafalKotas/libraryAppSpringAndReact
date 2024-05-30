# Interfejs graficzny dla aplikacji symulującej bibliotekę
## Dostępne role:
* czytelnik (reader) - może wypożyczać (max 3), oddawać, i zapisywać się w kolejce po książki
* bibliotekarz (librarian) - tak jak reader + może usuwać czytelników, dawać książki

## Rejestracja użytkowników:
* Sign up - rejestracja nowego użytkownika, generowanie losowych danych, czyszczenie, zaznaczenie ról
* Log in - dwufazowe (login, hasło) logowanie obecnego użytkownika
  
## Uruchamianie:
Z poziomu terminala wpisujemy w folderze głównym (z src, node_modules, public) komendę: 
```npm start```

**Uwaga!!!** Z powodu wielu zależności bibliotek, aplikacja działa z Node w starszej wersji - 14.0.0 (w 18.15.0 aplikacja się nie uruchamia)
