import { JsonDB, Config } from 'node-json-db'

// The first argument is the database filename. If no extension, '.json' is assumed and automatically added.
// The second argument is used to tell the DB to save after each push
// If you put false, you'll have to call the save() method.
// The third argument is to ask JsonDB to save the database in an human readable format. (default false)
// The last argument is the separator. By default it's slash (/)

export var db = new JsonDB(new Config('myDataBase', true, false, '/'))

export const pushData = async (path: string, data: any) => {
  if (!data?.[0]) {
    await data.forEach((element, index) => {
      try {
        db.push(`${path}[${index}]`, element, true)
      } catch (err) {
        console.log(err)
      }
    })
  } else {
    try {
      await db.push(path, data, true)
    } catch (err) {
      console.log(err)
    }
  }
}

export const appendData = async (path: string, data: any) => {
  try {
    await db.push(`${path}[]`, data, true)
  } catch (err) {
    console.log(err)
  }
}

export const getData = async (path: string) => {
  try {
    return await db.getData(path)
  } catch (err) {
    console.log(err)
    return
  }
}

export const deleteData = async (path: string) => {
  try {
    await db.delete(path)
  } catch (err) {
    console.log(err)
  }
}
