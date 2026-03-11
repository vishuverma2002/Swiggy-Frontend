
import { IoMdSettings } from "react-icons/io";
import Icon from "../icon/icon";
import styles from "./style.module.css"
function Settings({ onClick = () => { }, align = "right" }) {
  return (
    <span className={styles[align]}>
      <Icon align={align}>
        <IoMdSettings onClick={() => { onClick(); }} />
      </Icon>
    </span>
  );
}
export default Settings;
