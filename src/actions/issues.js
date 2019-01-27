export const LOADED_ISSUES = 'LOADED_ISSUES';
export function isLoaded (payload)  {
    return {type: LOADED_ISSUES, payload };
}

