import { forwardRef, useContext, useEffect, useRef } from "react";
import Link from "next/link";
import stylesMenu from "./styles/menu.module.css";
import styles from "../menu/styles/menu.module.css";
import { IoIosArrowDown } from "react-icons/io";
import { Context } from "@/store/store";
import { useRouter } from "next/router";

function handler({ route, r_index, isCollapsed = false, expandMenu }, containerRef) {
	const router = useRouter();
	const { active, setActive, currentPage, setCurrentPage } = useContext(Context);
	const ref = useRef();
	const isActive = active.includes(r_index);
	
	// Check if current page is in this menu's submenu
	const isCurrentPageInSubmenu = route?.submenu?.some((submenu) => {
		const currentPath = currentPage || router.asPath;
		return submenu.to === currentPath || 
		       router.asPath === submenu.to || 
		       router.asPath.startsWith(submenu.to + '/');
	});
	// Auto-expand menu item if current page is in its submenu
	useEffect(() => {
		if (route?.submenu && (currentPage || router.asPath)) {
			if (isCurrentPageInSubmenu && !isActive) {
				setActive([r_index]);
			}
		}
	}, [currentPage, router.asPath]);
	
	const handleMenuClick = (e) => {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}
		// If menu is collapsed, expand it first
		if (isCollapsed && expandMenu) {
			expandMenu();
		}
		setActive((prev) => {
			// If clicking on the currently active item, close it
			if (prev.includes(r_index)) {
				return [];
			}
			// Otherwise, close all others and open only this one
			return [r_index];
		});
	};
	
	const handleLinkClick = (e) => {
		e.stopPropagation();
		// If menu is collapsed, expand it first
		if (isCollapsed && expandMenu) {
			expandMenu();
		}
		setCurrentPage(route.to);
	};
	
	return (
		<ul key={r_index} ref={containerRef} className={styles.menuList}>
			{/* Main Menu Item */}
			<div 
				className={`${styles.menuItem} ${isActive ? styles.menuItemActive : ""}`}
				onClick={route?.to ? undefined : handleMenuClick}
				style={{ cursor: route?.to ? 'default' : 'pointer' }}
				role={route?.to ? undefined : "button"}
				tabIndex={route?.to ? undefined : 0}
				onKeyDown={route?.to ? undefined : (e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault();
						handleMenuClick(e);
					}
				}}
			>
				{/* Icon */}
				<div className={`${styles.iconContainer} ${isActive ? styles.iconContainerActive : ""}`}>
					<route.icon />
				</div>
				
				{/* Content */}
				<div className={styles.menuItemContent}>
					{route?.to ? (
						<Link 
							href={route.to} 
							className={styles.directLink}
							onClick={handleLinkClick}
						>
							<span className={styles.menuItemText}>{route.caption}</span>
						</Link>
					) : (
						<>
							<span 
								className={styles.menuItemText}
								style={{ flex: 1 }}
							>
								{route.caption}
							</span>
							{route?.submenu && (
								<span 
									className={`${styles.arrowIcon} ${isActive ? styles.arrowIconActive : ""}`}
								>
									<IoIosArrowDown />
								</span>
							)}
						</>
					)}
				</div>
			</div>

			{/* Submenu Items */}
			{route?.submenu && (
				<div className={`${styles.submenuContainer} ${isActive && !isCollapsed ? styles.submenuContainerOpen : styles.submenuContainerClosed}`}>
					{route.submenu.map((submenu, s_index) => {
						const isSubmenuActive = currentPage === submenu.to || 
							router.asPath === submenu.to || 
							router.asPath.startsWith(submenu.to + '/');
						
						return (
							<li 
								key={`${r_index}_${s_index}`} 
								className={`${styles.submenuItem} ${isSubmenuActive ? stylesMenu.activePage : ""}`}
								ref={isSubmenuActive ? ref : null}
							>
							<Link 
								className={`${styles.submenuLink} ${isSubmenuActive ? stylesMenu.activeColor : ""}`}
								onClick={(e) => {
									e.stopPropagation();
									// If menu is collapsed, expand it first
									if (isCollapsed && expandMenu) {
										expandMenu();
									}
									setCurrentPage(submenu.to);
								}} 
								href={submenu.to}
							>
								{submenu.caption}
							</Link>
							</li>
						);
					})}
				</div>
			)}
		</ul>
	);
}
const MenuAccordian = forwardRef(handler);
export default MenuAccordian;
