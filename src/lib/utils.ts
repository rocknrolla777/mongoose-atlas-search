

export const defaultSearchFunction = (query, path) => {
    return {
        text: {
            query,
            path
        }
    }
}


export const validateOptions = options => {
    if (!options.model) throw new Error('options.model is required!');
    if (!options.searchFunction && !options.path) throw new Error('options.path or options.searchFunction is required!');

    return {
        path: options.path,
        model: options.model,
        searchFunction: options.searchFunction || defaultSearchFunction,
        searchKey: options.searchKey || 'search',
        overwriteFind: options.overwriteFind || true,
        addFields: options.addFields
    }
}



export const buildAggregationQuery = (query, projection, queryOptions, options) => {
   const {
       searchFunction,
       path,
       searchKey,
       addFields
   } = options;

   const aggregationQuery = [];

   //search
   const searchStep = {'$search': searchFunction(query[searchKey], path)};
   aggregationQuery.push(searchStep);

    const matchStep = {$match: {}};
    Object.keys(query).forEach(key => {
        if (key !== searchKey) matchStep.$match[key] = query[key]
    });
    aggregationQuery.push(matchStep);


    const addFieldsStep = queryOptions.sort ? {$addFields: {score: { $meta: "searchScore" }}} : {};
    if (addFields) {
        addFieldsStep.$addFields = {...addFieldsStep.$addFields, ...addFields};
    }

    if (Object.keys(addFieldsStep).length) aggregationQuery.push(addFieldsStep);

    if (queryOptions.sort) {
        aggregationQuery.push({$sort: {score: -1, ...queryOptions.sort}});
    }

    if (queryOptions.skip) {
        aggregationQuery.push({$skip: queryOptions.skip});
    }

    if (queryOptions.limit) {
        aggregationQuery.push({$limit: queryOptions.limit});
    }

    if (projection) {
        aggregationQuery.push({
            $project: projection
        })
    }


   return aggregationQuery;

}