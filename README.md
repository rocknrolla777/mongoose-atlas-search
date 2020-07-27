# mongoose-atlas-search
> Plugin to use MongoDB Atlas Search feature.


Flexible mongoose plugin that converts simple find function to aggregation with Atlas Search support, if search value is in query.

[Atlas Search Docs](https://docs.atlas.mongodb.com/atlas-search/)


## Requirements


Atlas Search is available on all cluster tiers running MongoDB version 4.2 or later. Non-Atlas MongoDB deployments can not use it!

**Important! Indexes must be created [manually](https://docs.atlas.mongodb.com/reference/atlas-search/create-index/)!**
## Installation


```sh
npm install mongoose-atlas-search --save
```

## Usage

```javascript
const mongoose = require('mongoose');
const atlasPlugin = require('mongoose-atlas-search');


const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: String,
    email: String,
    languagel: String,
  },
  {collection: 'users'}
);


const UserModel = mongoose.model('User', UserSchema);


//atlasPlugin.initialize(<options>);
atlasPlugin.initialize({
  model: UserModel,
  overwriteFind: true,
  searchKey: 'search',
  addFields: {
    id: '$_id'
  },
  searchFunction: query => {
    return {
      'wildcard': {
        'query': `${query}*`,
        'path': '_id',
        'allowAnalyzedField': true
      }
    }
  }

});


(async () => {
  const resultWithSearch = await UserModel.find({search: 'test user'}); //aggregation is used
  const resultWithoutSearch = await UserModel.find({name: 'test user'}); //standard "find" is used
})();
```

## Options

| option | type | description | required |
| ------ | ---- | ----------- | -------- |
|model|object|Instance of mongoose.Model|true|
|searchKey|string|Key name in query to detect that Atlas Search should be used. Default: **'search'**|false|
|overwriteFind|boolean|If true, standard "find" function is overwritten. If false - plugin adds new function Model.search(query, projection, opts). Default: **true**| false|
|searchFunction|function|Need to customize search step in aggregation. See example above. By default, text operator is used: **{text: {searchValue, path}**|false|
|path|string or \[string\]| Required if searchFunction option is not defined|depends on searchFunction option|
|addFields|object|Add aggregation step "addFields". In example above "id" field is added.|false|


## Meta

Sergey Reus - serg.reus.it@gmail.com - [GitHub](https://github.com/rocknrolla777) - [stackoverflow](https://stackoverflow.com/users/13535158/sergey-reus)

Feel free to create issues or PRs.




