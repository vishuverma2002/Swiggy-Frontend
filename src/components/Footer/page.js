"use client";

import React from "react";
import styles from "./footer.module.css";
import Link from "next/link";
import Heading from "../heading/Heading";
import { defaultFooterData } from "./footerData";

const Footer = ({ cta, sections, copyright, developer, data: dataProp }) => {
  const data = dataProp || {
    cta: cta ?? defaultFooterData.cta,
    sections: sections ?? defaultFooterData.sections,
    copyright: copyright ?? defaultFooterData.copyright,
    developer: developer ?? defaultFooterData.developer,
  };

  const { cta: ctaData, sections: sectionsData, copyright: copyrightText, developer: developerText } = data;

  return (
    <footer className={styles.footer}>
      <div className={styles.ctaBlock}>
        <Heading type="heading_primary">
          {ctaData.title} <span>{ctaData.appName}</span> {ctaData.suffix}
        </Heading>
      </div>
      <div className={styles.footerSection}>
        <div className={styles.footerLinks}>
          {sectionsData.map((section, index) => (
            <div
              key={section.id ?? index}
              className={`${styles.footerLinkSection} ${
                section.isHighlighted ? styles.footerLinkSectionHighlighted : ""
              }`}
            >
              <Heading
                text={section.title}
                type="heading_secondary"
                as="h4"
              />
              {section.isSocial ? (
                <div className={styles.socialMedia}>
                  {section.socialLinks?.map((item, i) => {
                    const IconComponent = item.icon;
                    return (
                      <span key={item.url ?? i}>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {IconComponent ? <IconComponent /> : null}
                        </a>
                      </span>
                    );
                  })}
                </div>
              ) : (
                section.links?.map((link, i) => (
                  <Link
                    key={i}
                    href={link.href}
                    className={styles.footerLink}
                  >
                    {link.label}
                  </Link>
                ))
              )}
            </div>
          ))}
        </div>
        <hr className={styles.divider} />

        <div className={styles.footerBelow}>
          <div className={styles.footerCopyright}>
            <p>{copyrightText}</p>
            <p className={styles.developerCredit}>{developerText}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default React.memo(Footer);
