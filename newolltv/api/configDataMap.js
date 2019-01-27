export default function configDataMap(response) {
    const { order, menu } = response.data;
    return { order, menu };
}
