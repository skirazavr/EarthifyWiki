import { useEffect } from "react";

export default function Season() {
  useEffect(() => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    let className = "";

    if ((month === 12 && day >= 24) || (month === 1 && day <= 8)) className = "christmas";
    else if ((month === 12 && day <= 23) || (month === 1 && day >= 9) || month === 2) className = "winter";
    else if (month >= 3 && month <= 5) className = "spring";

    if (className) document.body.classList.add(className);
    return () => {
      if (className) document.body.classList.remove(className);
    };
  }, []);

  return null;
}
