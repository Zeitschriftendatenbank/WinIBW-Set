# WinIBW-Set
Bearbeite alle Titel eines Sets

## Beispiel

### Bearbeitung von Titeln

```javascript
function setBearbeiteTitel {
    var set = new SET('setBearbeiteTitel.log', 'd', '1026734010'),
        i, t;
    while (i = set.nextTit()) {
        t = set.edit(i); // t entspricht application.activeWindow.title
        // Bearbeite den Titel
        if(condition) {
            set.save(true, "Datensatz bearbeitet.");
        } else {
            set.save(false; "Datensatz wurde nicht bearbeitet.")
        }
    }
}
```
### Bearbeitung von Bestandsdatensätzen

```javascript
function setBearbeiteExemplar {
    var set = new SET('setBearbeiteExemplar.log', 'd', '1026734010'),
        i, e;
    while (i = set.nextTit()) {
        while (e = set.nextEx()) {
            var occurrence = set.current_ex + 1; // set.current_ex beginnt bei 0
            occurrence = '0' + occurrence;
            if(occurrence !== set.exNum){
                e.findTag('E0' + set.exNum, false, true, false);
            }

            e.insertText(e.selection.replace(set.exNum, occurrence));
            set.save(true, set.exNum + "FL-Code war schon vorhanden");
        }
    }
}
```
## Parameter

### logFilename
Name der LOG-Datei. 

### format
Katalogisierungsformat ('d' (Default) oder 'p');


### eigeneBibliothek 
PPN/IDN des Bibliotheksdatensatzes. Nur Bestände dieser Bibliothek werden bearbeitet. Optional

## Abhängigkeit
WinIBW-LOGGER muss eingebunden sein.

## Properties

### set.next
Position des nächsten Titels im Set

### set.current
Nummer des aktuellen Titel im Set

### set.next_ex
Nummer des nächsten Bestandsdatensatzes,beginnt bei 1

### set.current_ex
Nummer des aktuellen Bestandsdatensatzes, beginnt bei 0

### set.alleExe
Array aller Exemplarnummern

### set.exNum
Nummer des aktuellen Bestandsdatensatzes

### set.eigeneBibliothek
PPN/IDN der eigenen Bibliothek

### set.logger
Instanz von winibw-logger

## Methoden

### set.nextTit()
Ruft den nächsten Titel auf. Gibt die Position des aktuellen Titels im Set zurück.

### set.edit(num)
Setzt den aktuellen Titel in den Bearbeitungsmodus. Gibt das Titel-Objekt (application.activeWindow.title) zurück.

Paramter:  (Int) Nummer des zu editierenden Titels

### set.nextEx(eigeneBibliothek)
Setzt den aktuellen Bestandsdatensatz in den Bearbeitungsmodus. Gibt das Titel-Objekt (application.activeWindow.title) zurück.

Parameter: (String) PPN/IDN der eigenen Bibliothek. Optional

### set.save(save, message)
Setzt den aktuellen Datensatz von Bearbeitungsmodus in den Ansichtsmodus. Entweder durch Speichern der Änderungen oder durch Verlassen des Datensatzes ohne zu speichern.

Parameter 1: (Bool) TRUE, wenn gespeichert werden soll, FALSE, wenn nicht.
Parameter 2; (String) Nachricht, die geloggt werden soll.

### set.log(message)
Loggt eine Nachricht.