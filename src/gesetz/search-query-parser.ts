import gesetzeJson from "../gesetze.json";


function createLowerCaseIndex(keys: string[]): { [lower: string]: string } {
    const mapping: { [lower: string]: string } = {};
    keys.forEach(key =>
        mapping[key.toLowerCase()] = key)
    return mapping
}

const lowerCaseGesetzeJsonMapping = createLowerCaseIndex(Object.keys(gesetzeJson));

function cleanNormQuery(query: string) {
    return query.trim().toLowerCase();
}

export interface SearchQuery {
    gesetzId?: string;
    normId?: string;
    lastElement: 'gesetz' | 'norm';
}

export function parseSearchQuery(query: string): SearchQuery | null {
    if (!query?.length) {
        return null;
    }

    var reg = /^(Art\.|Art(ikel|icle)?(?![A-Za-zöäß])|§+)\s*/i;
    const splitted = query.trim().replace(reg, "").split(" ");
    if (splitted.length === 1) {
        if (lowerCaseGesetzeJsonMapping.hasOwnProperty(cleanNormQuery(splitted[0]))) {
            // Query contains only query for gesetz
            return { gesetzId: lowerCaseGesetzeJsonMapping[cleanNormQuery(splitted[0])], lastElement: 'gesetz' };
        } else {
            // Query contains only query for norm
            return { normId: cleanNormQuery(splitted[0]), lastElement: 'norm' };
        }
    }
    if (splitted.length === 2) {
        const gesetzeQueryFirst = cleanNormQuery(splitted[0]);
        const gesetzeQueryLast = cleanNormQuery(splitted[1]);
        const gesetzeQueryFirstIsValid = lowerCaseGesetzeJsonMapping.hasOwnProperty(gesetzeQueryFirst);
        const gesetzeQueryLastIsValid = lowerCaseGesetzeJsonMapping.hasOwnProperty(gesetzeQueryLast);

        if (gesetzeQueryFirstIsValid && gesetzeQueryLastIsValid) {
            return null;
        } else if (gesetzeQueryFirstIsValid) {
            return { gesetzId: lowerCaseGesetzeJsonMapping[gesetzeQueryFirst], normId: cleanNormQuery(splitted[1]), lastElement: 'norm' };
        } else if (gesetzeQueryLastIsValid) {
            return { gesetzId: lowerCaseGesetzeJsonMapping[gesetzeQueryLast], normId: cleanNormQuery(splitted[0]), lastElement: 'gesetz' }
        }

    }
    return null;
}

export function formatQuery(query: SearchQuery): string {
    if (query.lastElement === "gesetz") {
        if (!!query.normId) {
            return `${query.normId} ${query.gesetzId}`
        } else {
            return query.gesetzId || '';
        }
    } else {
        return `${query.gesetzId} ${query.normId}`
    }
}