import { routes } from "@/forms/routes";
import styles from "./styles/menu.module.css";
import MenuAccordian from "../menu_accordian";
import { useRef } from "react";

export default function Menu({ isCollapsed = false, expandMenu }) {
	return (
		<div className={`${styles.menu} ${isCollapsed ? styles.menuCollapsed : ""}`} key={"menuContainer"} data-collapse={isCollapsed}>
			{routes &&
				routes.map((route, r_index) => {
					return <MenuAccordian route={route} r_index={r_index} isCollapsed={isCollapsed} expandMenu={expandMenu} key={r_index} />;
				})}

		</div>
	);
}
