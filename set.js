function SET(logFilename, format, eigeneBibliothek) {
    this.format = format || 'd';
    try {
        this.setSize = activeWindow.getVariable('P3GSZ');
    } catch (e) {
        this.setSize = 0;
    }
    this.next = 1;
    this.current = 1;
    this.next_ex = 0;
    this.current_ex = 0;
    this.alleExe = false;
    this.exNum = false;
    this.eigeneBibliothek = eigeneBibliothek || false;
    if (typeof LOGGER === 'undefined') {
        throw 'LOGGER ist nicht installiert. Bitte winibw-logger.js einbinden.';
    }

    try {
        this.logger = new LOGGER(logFilename);
    } catch (e) {
        this.logger = false;
    }
}

SET.prototype = {
    nextTit:
        function () {
            this.current = this.next;
            if (this.current <= this.setSize) {
                activeWindow.command('\\too ' + this.format + ' ' + this.current, false);
                this.__ex_numbers();
                this.next += 1;
                return this.current;
            }
            return false;
        },
    edit:
        function (ex) {
            var exe = ex || '';
            activeWindow.command('\\mut ' + this.format + ' ' + exe, false);
            if ('MEMT'.indexOf(activeWindow.getVariable('src')) == -1) {
                throw this.__getMessages();
            }
            return activeWindow.title;
        },
    nextEx:
        function (eigeneBibliothek) {
            this.eigeneBibliothek = eigeneBibliothek || this.eigeneBibliothek;
            if (!this.alleExe) {
                this.__ex_numbers();
            }
            this.current_ex = this.next_ex;
            if (this.current_ex < this.alleExe.length) {
                this.exNum = this.alleExe[this.current_ex];
                var ex = this.edit('e' + this.exNum);

                this.next_ex += 1;
                if (this.eigeneBibliothek && !this.__test_eigene(ex, this.eigeneBibliothek)) {
                    activeWindow.simulateIBWKey('FR'); // exit Exemplar
                    return this.nextEx();
                }
                return ex;
            }
            return false;
        },
    save:
        function (save, message) {
            if (false === this.logger) {
                throw 'Es wurde kein LOG-File angegeben.';
            }
            message = message || false;
            save = save || true;
            if (save == false) {
                // return undone but write error to a log file
                activeWindow.simulateIBWKey('FE');
            } else {
                activeWindow.simulateIBWKey('FR');
            }

            var status = activeWindow.status,
                cbsMessage = this.__getMessages();

            if (status == 'OK') {
                if (message) {
                    message = status + "\t" + cbsMessage + "\t" + message;
                }
            } else {
                // an error occured
                //return undone but write error to a log file
                activeWindow.simulateIBWKey('FE');
                message = status + "\t" + cbsMessage;
            }

            if (message) {
                this.logger.log(message);
            }
        },
    log:
        function (message) {
            this.logger.log(message);
        },
    __test_eigene:
        function (ex, eigeneBibliothek) {
            this.eigeneBibliothek = eigeneBibliothek;
            var kat, i, regex;
            switch (this.format) {
                case 'd':
                    kat = '4800';
                    regex = new RegExp('!(.+)!');
                    break;
                case 'p':
                    kat = '247C';
                    regex = new RegExp(ZDB.delimiter + '9(.+)' + ZDB.delimiter + '8');
                    break;
            }
            ex.findTag(kat, 0, false, true, false);
            var idn = regex.exec(ex.selection);
            if (this.eigeneBibliothek.constructor == Array) {
                for (i = 0; i < this.eigeneBibliothek.length; i += 1) {
                    if (this.eigeneBibliothek[i] == idn[1]) {
                        return true;
                    }
                }
                return false;
            }
            if (this.eigeneBibliothek.indexOf(idn[1]) == -1) {
                return false;
            }
            return true;
        },
    __ex_numbers:
        function () {
            this.next_ex = 0;
            this.current_ex = 0;
            var regexpExe,
                strTitle = (function () { try { return activeWindow.getVariable('P3CLIP'); } catch (e) { return ''; } }()),
                match;
            switch (this.format) {
                case 'd':
                    regexpExe = new RegExp('\nE([0-9][0-9][0-9])', 'g');
                    break;
                case 'p':
                    regexpExe = new RegExp('\n208@\/([0-9][0-9])', 'g');
                    break;
            }
            this.alleExe = [];
            while ((match = regexpExe.exec(strTitle)) !== null) {
                this.alleExe.push(match[1].replace(/^0+/, ''));
            }
        },
    __getMessages:
        function () {
            var messageText = '',
                i,
                msgs = utility.messages();
            if (msgs.count > 0) {
                for (i = 0; i < msgs.count; i += 1) {
                    messageText += msgs.item(i).text + ';';
                }
            } else {
                return '';
            }
            return messageText;
        }
};