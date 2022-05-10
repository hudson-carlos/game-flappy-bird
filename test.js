function main(entradas) {
  const arr = entradas.trim().split("\n");
  const v = arr[1].split(" ");
  const c = arr[2].length > 1 ? arr[2].split(" ") : arr[3].split(" ");

  c.forEach((num) => {
    let r = [...v, num]
      .map((num) => Number(num))
      .filter((num, x, arr) => x === arr.indexOf(num))
      .sort((a, b) => b - a);

    console.log(r.indexOf(Number(num)) + 1);
  });
}

const e = "7\n55 100 100 40 100 50 35\n20 60 40 10";
main(e);
