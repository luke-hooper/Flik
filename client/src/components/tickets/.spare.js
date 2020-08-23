const [arrowStyle, setUpArrowStyle] = useState({
  arrowOn: { borderColor: "var(--primary-color) transparent" },
  arrowOff: { borderColor: "var(--dark-color) transparent" }
});

let upArrow = arrowStyle.arrowOn;
let downArrow = arrowStyle.arrowOff;

const handleClick = () => {
  if (upArrow === arrowStyle.arrowOn) {
    upArrow = arrowStyle.arrowOff;
    downArrow = arrowStyle.arrowOn;
  } else {
    upArrow = arrowStyle.arrowOn;
    downArrow = arrowStyle.arrowOff;
  }
};
