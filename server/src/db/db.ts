import Database from 'better-sqlite3';

const db = new Database('db/kss.db', {verbose: console.log});

db.exec('CREATE TABLE IF NOT EXISTS consumption (' +
    'userId TEXT NOT NULL,' +
    'month INTEGER NOT NULL,' +
    'year INTEGER NOT NULL,' +
    'consumption INTEGER NOT NULL)');

export const saveToDb = (userId: string, month: number, year: number, consumption: number) => {
    let stmt = db.prepare('SELECT * FROM consumption WHERE userId=@userId AND month=@month AND year=@year');
    const existing = stmt.get({userId, month, year});
    if (!existing) {
        stmt = db.prepare('INSERT INTO consumption VALUES (?, ?, ?, ?)');
        stmt.run(userId, month, year, consumption);
    } else {
        stmt = db.prepare('UPDATE consumption SET consumption=@consumption WHERE userId=@userId AND month=@month AND year=@year');
        stmt.run({userId, month, year, consumption});
    }
};

export const findAllByUserId = (userId: string) => {
    const stmt = db.prepare('SELECT * FROM consumption WHERE userId=@userId');
    const rows = stmt.all({userId});
    return rows.reduce((result, obj) => {
        const {year, month, consumption} = obj;
        const yearObj = result[year] || {};
        yearObj[month] = consumption;
        result[year] = yearObj
        return result;
    }, {});
}