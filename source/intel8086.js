// Michał Pajerski 1 rok Informatyka Stosowana

// Funkcja wykonania rozkazu MOV
function executeMov() {
    const source = document.getElementById('source').value; // Pobranie wybranego źródła
    const destination = document.getElementById('destination').value; // Pobranie wybranego celu

    if (source === destination) {
        alert("Źródłowy i docelowy rejestr są takie same!");
        return;
    }

    const sourceValue = document.getElementById(source).value; // Pobranie wartości z rejestru źródłowego
    document.getElementById(destination).value = sourceValue; // Przeniesienie wartości do rejestru docelowego
}

// Funkcja wykonania rozkazu XCHG
function executeXchg() {
    const reg1 = document.getElementById('source').value; // Pobranie pierwszego rejestru
    const reg2 = document.getElementById('destination').value; // Pobranie drugiego rejestru

    if (reg1 === reg2) {
        alert("Nie można zamieniać tego samego rejestru!");
        return;
    }
    // Zamiana wartości między rejestrami
    const reg1Value = document.getElementById(reg1).value;
    const reg2Value = document.getElementById(reg2).value;

    document.getElementById(reg1).value = reg2Value;
    document.getElementById(reg2).value = reg1Value;
}

// Generowanie losowej liczby w zakresie 16-bitowym (0000-FFFF)
function getRandomHexValue() {
    const randomValue = Math.floor(Math.random() * 0x10000); // Maksymalna wartość: 65535 (FFFF w hex)
    return randomValue.toString(16).toUpperCase().padStart(4, '0'); // Format jako 4-cyfrowy HEX
}

// Funkcja resetu z losowymi wartościami
function randomizeRegisters() {
    document.querySelectorAll('.register input').forEach(input => {
        input.value = getRandomHexValue();
    });
}

function resetRegisters() {
    document.querySelectorAll('.register input').forEach(input => {
        input.value = '0000';
    });
}

function randomizeMemory() {
    document.querySelectorAll('.mem input').forEach(input => {
        input.value = getRandomHexValue();
    });
}

function resetMemory() {
    document.querySelectorAll('.mem input').forEach(input => {
        input.value = '0000';
    });
}

// Obliczanie adresu w zależności od wybranego trybu adresowania
function calculateMemoryAddress() {
    const bx = parseInt(document.getElementById('bx').value, 16) || 0;
    const bp = parseInt(document.getElementById('bp').value, 16) || 0;
    const si = parseInt(document.getElementById('si').value, 16) || 0;
    const di = parseInt(document.getElementById('di').value, 16) || 0;
    const offset = parseInt(document.getElementById('offset').value, 16) || 0;

    const mode = document.getElementById('addressingMode').value;

    let address = 0;
    if (mode === 'base') {
        address = bx + offset;
    } else if (mode === 'index') {
        address = si + offset;
    } else if (mode === 'baseIndex') {
        address = bx + si + offset;
    }

    document.getElementById('memoryAddress').value = address.toString(16).toUpperCase().padStart(4, '0');
    return address;
}

// MOV z pamięci do rejestru
function movToRegister() {
    const memoryValue = document.getElementById('memoryValue').value; // Pobranie wartości z pamięci
    const destination = document.getElementById('destination').value; // Pobranie rejestru docelowego

    document.getElementById(destination).value = memoryValue; // Przesłanie wartości do rejestru
}

// MOV z rejestru do pamięci
function movToMemory() {
    const source = document.getElementById('source').value; // Pobranie rejestru źródłowego
    const memoryValue = document.getElementById(source).value; // Pobranie wartości z rejestru

    document.getElementById('memoryValue').value = memoryValue; // Przesłanie wartości do pamięci
}

// XCHG z pamięci do rejestru
function xchgMemory() {
      // Pobierz nazwę wybranego rejestru źródłowego
      const sourceRegister = document.getElementById('source').value;
      // Pobierz wartość rejestru źródłowego
      const sourceValue = document.getElementById(sourceRegister).value;
      // Pobierz wartość z pamięci
      const memoryValue = document.getElementById('memoryValue').value;
      // Zamień wartości
      document.getElementById(sourceRegister).value = memoryValue;
      document.getElementById('memoryValue').value = sourceValue;
      // Dodaj log lub komunikat, jeśli potrzebne
      console.log(`Wymieniono wartości: ${sourceRegister} = ${memoryValue}, Pamięć = ${sourceValue}`);
  }

// Funkcja walidacji danych w formacie szesnastkowym
function validateHexInput(input) {
    // Pobierz wartość z pola tekstowego
    let value = input.value.toUpperCase(); // Zamień litery na wielkie
    const validHexPattern = /^[0-9A-F]*$/; // Dozwolone znaki: 0-9, A-F

    // Usuń niedozwolone znaki
    if (!validHexPattern.test(value)) {
        alert('Wpisz poprawną wartość w formacie szesnastkowym (0-9, A-F)!');
        value = value.replace(/[^0-9A-F]/g, ''); // Usuń niepoprawne znaki
    }

    // Przycięcie wartości do maksymalnie 4 znaków
    if (value.length > 4) {
        alert('Wartość nie może przekraczać 4 cyfr!');
        value = value.slice(0, 4); // Obetnij do 4 znaków
    }

    // Zaktualizuj pole tekstowe
    input.value = value;
}

// Inicjalizacja stosu
const stack = [];
const stackLimit = 10; // Maksymalny rozmiar stosu
let sp = 0xFFFF; // Początkowy wskaźnik stosu (Stack Pointer)

// Obsługa operacji PUSH
function executePush() {
    const selectedRegister = document.getElementById('stackRegister').value; // Pobierz wybrany rejestr
    const registerValue = document.getElementById(selectedRegister).value; // Pobierz wartość z rejestru

    if (stack.length >= stackLimit) {
        alert("Błąd: Stos przepełniony!");
        return;
    }

    stack.push(registerValue); // Umieść wartość na stosie
    sp -= 2; // Zmniejsz wskaźnik stosu
    console.log(`PUSH: Wartość ${registerValue} z ${selectedRegister} została dodana na stos.`);
    updateStackDisplay();
}

// Obsługa operacji POP
function executePop() {
    if (stack.length === 0) {
        alert("Błąd: Stos pusty!");
        return;
    }

    const selectedRegister = document.getElementById('stackRegister').value; // Pobierz wybrany rejestr
    const poppedValue = stack.pop(); // Pobierz wartość ze stosu

    document.getElementById(selectedRegister).value = poppedValue; // Przypisz wartość do rejestru
    sp += 2; // Zwiększ wskaźnik stosu
    console.log(`POP: Wartość ${poppedValue} została zdjęta ze stosu i zapisana w ${selectedRegister}.`);
    updateStackDisplay();
}

// Aktualizacja wyświetlania stosu (opcjonalna funkcjonalność)
function updateStackDisplay() {
    const stackDisplay = document.getElementById('stackDisplay');
    if (stackDisplay) {
        stackDisplay.innerHTML = stack
            .map((value, index) => `Adres: ${(0xFFFF - index * 2).toString(16).toUpperCase()} → Wartość: ${value}`)
            .join('<br>');
    }
}