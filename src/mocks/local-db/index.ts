import { JsonDB } from 'node-json-db'
import { Config } from 'node-json-db/dist/lib/JsonDBConfig'

// The first argument is the database filename. If no extension, '.json' is assumed and automatically added.
// The second argument is used to tell the DB to save after each push
// If you put false, you'll have to call the save() method.
// The third argument is to ask JsonDB to save the database in an human readable format. (default false)
// The last argument is the separator. By default it's slash (/)

export const db = new JsonDB(new Config('myDataBase', true, false, '/'))

export const pushData = (path: string, data: any) => {
  if (!data?.[0]) {
    data.forEach((element, index) => {
      db.push(`${path}[${index}]`, element, true)
    })
  } else {
    db.push(path, data, true)
  }
}

export const appendData = (path: string, data: any) => {
  db.push(`${path}[]`, data, true)
}

export const getData = (path: string) => {
  return db.getData(path)
}

export const deleteData = (path: string) => {
  db.delete(path)
}
