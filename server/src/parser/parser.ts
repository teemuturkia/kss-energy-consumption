import XLSX from 'xlsx';
import { saveToDb } from '../db/db';

interface IMonths {
    [key: string]: any
}

const months: IMonths = {
    tammikuu: 1,
    helmikuu: 2,
    maaliskuu: 3,
    huhtikuu: 4,
    toukokuu: 5,
    'kesäkuu': 6,
    'heinäkuu': 7,
    elokuu: 8,
    syyskuu: 9,
    lokakuu: 10,
    marraskuu: 11,
    joulukuu: 12
};

const parseMonth = (monthStr: string) => {
    const parts = monthStr.split(' ');
    if (parts.length !== 2) {
        throw new Error('Invalid date row: ' + monthStr);
    }
    const month = months[parts[0].trim()];
    if (!month) {
        throw new Error('Invalid date row: ' + monthStr);
    }
    const year = parseInt(parts[1]);
    return {month, year};
}

const excelParser = {
    parse: (path: string, userId: string) => {
        const workbook = XLSX.readFile(path);
        const sheet = Object.values(workbook.Sheets)[0];
        for (let i = 3; i < 15; i++) {
            const monthStr = sheet['A' + i];
            if (!monthStr) {
                break;
            }
            const {month, year} = parseMonth(monthStr.v);
            const consumption = Math.round(sheet['B' + i].v);
            saveToDb(userId, month, year, consumption);
        }
    }
}

export default excelParser.parse;