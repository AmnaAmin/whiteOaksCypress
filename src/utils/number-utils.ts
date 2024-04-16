export const preventNegativeKeyDownFn = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e?.code === 'Minus') {
    e.preventDefault()
  }
}

export const preventFurtherDecimalPlaces = (number: number, decimalPlaces: number) => {
    if (!number.toString().includes(".")) return number;
    const dec = number.toString().split(".")[1];
    if (dec.length <= decimalPlaces) {
        return number;
    } else {
        return number.toFixed(decimalPlaces);
    }
}