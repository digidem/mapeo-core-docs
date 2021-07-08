import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

const FeatureList = [
  {
    title: 'Offline-first',
    Svg: require('../../static/img/undraw_nature_m5ll.svg').default,
    description: (
      <>
        No Internet? No problem. Create, edit and synchronize data completely offline.
      </>
    ),
  },
  {
    title: 'Decentralized',
    Svg: require('../../static/img/undraw_connection_b38q.svg').default,
    description: (
      <>
        No servers to setup, no central database, data is replicated on all Mapeo clients.
      </>
    ),
  },
  {
    title: 'Collaborate',
    Svg: require('../../static/img/undraw_online_connection_6778.svg').default,
    description: (
      <>
        Mapeo Core is designed for groups of users to collaborate on a shared dataset.
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} alt={title} />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
