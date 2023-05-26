const Shorten = (str: string, length = 200) => {
  let content: string = "";
  if (str.length > length) {
    content = str.substring(0, length - 2);
    content = content + "...";
  } else {
    content = str;
  }
  return content;
};

export default Shorten;