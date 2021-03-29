export default class UtilsDates {

    constructor() {}

    getMonday(d: Date | string) {
        d = new Date(d);
        const day = d.getDay();
        const diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
        return new Date(d.setDate(diff));
    }

    getFormatDate(d: Date | string, separator: string = null, add: number = null) {
        d = new Date(d);

        if (add) {
            d.setDate(d.getDate() + add);
        }

        let day = d.getDate();
        let month = d.getMonth() + 1;
        if (separator) {
            return `${d.getFullYear()}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
        } else {
            return `${d.getFullYear()}${month < 10 ? '0' + month : month}${day < 10 ? '0' + day : day}`;
        }
    }
}
