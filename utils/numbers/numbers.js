export const bigIntGenerator = () => Array(16).fill()
                                              .map(() => Math.round(Math.random() * 0xF).toString(16))
                                              .join('');