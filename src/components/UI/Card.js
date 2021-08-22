import classes from "./Card.module.css";

const Meals = (props) => {
  return <div className={classes.card}>{props.children}</div>;
};

export default Meals;
