
import {validateOptions, buildAggregationQuery, defaultSearchFunction} from './lib/utils';

interface IPluginOptions {
    model: object,
    searchKey?: string,
    overwriteFind?: boolean,
    path?: string|[string],
    searchFunction?: (query: string) => object,
    addFields?: object
}

const atlasSearchPlugin = {
        initialize: (options: IPluginOptions) => {
            const pluginOptions = validateOptions(options);
            const {
                model,
                searchKey,
                overwriteFind
            } = pluginOptions;



            const find = model.find.bind(model);
            const aggregation = model.aggregate.bind(model);


            if (overwriteFind) {
                model.find = function (query, projection, queryOptions = {}) {
                    if (query[searchKey]) {
                        const aggregationQuery = buildAggregationQuery(query, projection, queryOptions, pluginOptions);
                        return aggregation(aggregationQuery);
                    } else return find(query, projection, queryOptions);
                }
            } else {
                model.search = function (query, projection, queryOptions = {}) {
                    if (!query[searchKey]) throw new Error(`${searchKey} query param is required!`);
                    const aggregationQuery = buildAggregationQuery(query, projection, queryOptions, pluginOptions);
                    return aggregation(aggregationQuery);
                }
            }
        },
}

export = atlasSearchPlugin;