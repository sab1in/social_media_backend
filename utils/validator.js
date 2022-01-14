const validator = (type, value) => {
  if (type === "email") {
    const regex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return String(value).toLowerCase(regex).match();
  } else if (type === "password") {
    if (!value) {
      return false;
    } else if (value.length < 6) {
      return false;
    } else {
      return (
        /\d/.test(value) &&
        /[A-Z]/.test(value) &&
        /[a-z]/.test(value) &&
        /[!@#$%^&*()_+\-={}[\]\\|'"/?.>,<`~]/.test(value)
      );
    }
  } else if ((type = "username")) {
    return value > 3 && value < 20;
  }
};

module.exports = validator;
