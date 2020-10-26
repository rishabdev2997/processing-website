import React, { useState } from 'react';
import { graphql } from 'gatsby';
import { Link } from 'gatsby';
import classnames from 'classnames';

import Img from 'gatsby-image';

import Layout from '../components/Layout';
import Sidebar from '../components/Sidebar';

import css from '../styles/tutorials/ref-template.module.css';
import grid from '../styles/grid.module.css';

const RefTemplate = ({ data, pageContext }) => {
  let entry;
  const [show, setShow] = useState(false);

  if (data.json !== null) {
    entry = data.json.childJson;
  }

  const link =
    pageContext.libraryName === 'processing'
      ? `/reference/${pageContext.name}.html`
      : `/reference/libraries/${pageContext.libraryName}/${pageContext.name}.html`;

  const examples = data.pdes.edges;
  const images = data.images.edges;

  const toggleSidebar = (show) => {
    setShow(show);
  };

  return (
    <Layout>
      {pageContext.libraryName === 'processing' && (
        <Sidebar
          items={data.items}
          onChange={toggleSidebar}
          show={show}
          type={'reference'}
        />
      )}
      {data.json !== null ? (
        <div className={classnames(css.root, { [css.collapsed]: !show })}>
          <div className={classnames(css.section, grid.grid)}>
            <h4 className={classnames(grid.col1, grid.push1)}>Name</h4>
            <h3 className={classnames(grid.col4, grid.pull1)}>{entry.name}</h3>
          </div>
          <div className={classnames(css.section, grid.grid)}>
            <h4 className={classnames(grid.col1, grid.push1)}>Description</h4>
            <p
              className={classnames(grid.col4, grid.pull1, css.description)}
              dangerouslySetInnerHTML={{ __html: entry.description }}
            />
          </div>
          {examples.length > 0 && (
            <div className={classnames(css.section, grid.grid)}>
              <h4 className={classnames(grid.col1, grid.push1)}>Examples</h4>
              <ul
                className={classnames(
                  grid.col1,
                  grid.col6,
                  grid.nest,
                  css.list
                )}>
                {examples.map((ex, key) => {
                  const img = images.filter(
                    (img) => img.node.name === ex.node.name
                  );
                  return (
                    <li className={css.example} key={'ex' + key}>
                      <div className={grid.col4}>
                        <pre className={css.codeBlock}>
                          {ex.node.internal.content
                            .split(/\r?\n/)
                            .map((line, i) => (
                              <code key={`line-${i}`}>{line}</code>
                            ))}
                        </pre>
                      </div>
                      {img && (
                        <div className={grid.col2}>
                          <Img fixed={img[0].node.childImageSharp.fixed} />
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          <div className={classnames(css.section, grid.grid)}>
            <h4 className={classnames(grid.col1, grid.push1)}>Syntax</h4>
            <ul className={classnames(grid.col4, grid.pull1, css.list)}>
              {entry.syntax.map((syn, key) => {
                return (
                  <li key={'s' + key}>
                    <code>{syn}</code>
                  </li>
                );
              })}
            </ul>
          </div>
          {entry.parameters.length > 0 && (
            <div className={classnames(css.section, grid.grid)}>
              <h4 className={classnames(grid.col1, grid.push1)}>Parameters</h4>
              <ul className={classnames(grid.col5, grid.nest, css.list)}>
                {entry.parameters.map((param, key) => {
                  return (
                    <li key={'param' + key} className={css.param}>
                      <span className={classnames(grid.col1, css.paramName)}>
                        {param.name}
                      </span>
                      <span className={grid.col5}>
                        {param.type + ': ' + param.description}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          {entry.returns && (
            <div className={classnames(css.section, grid.grid)}>
              <h4 className={classnames(grid.col1, grid.push1)}>Return</h4>
              <p className={classnames(grid.col4, grid.pull1)}>
                <code>{entry.returns}</code>
              </p>
            </div>
          )}
          {entry.inUse && (
            <div className={classnames(css.section, grid.grid)}>
              <h4 className={classnames(grid.col1, grid.push1)}>In use</h4>
              <ul
                className={classnames(
                  grid.col4,
                  grid.nest,
                  css.list,
                  grid.pull1
                )}>
                {entry.inUse.map((inUse, key) => (
                  <li key={key + 'rel'}>
                    <a href={inUse + '.html'} className={grid.col4}>
                      {inUse.replace(/_/g, '()')}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {entry.related.length > 0 && (
            <div className={classnames(css.section, grid.grid)}>
              <h4 className={classnames(grid.col1, grid.push1)}>Related</h4>
              <ul
                className={classnames(
                  grid.col4,
                  grid.nest,
                  css.list,
                  grid.pull1
                )}>
                {entry.related.map((rel, key) => (
                  <li key={key + 'rel'}>
                    <a href={rel + '.html'} className={grid.col4}>
                      {rel.replace(/_/g, '()')}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className={classnames(css.section, grid.grid)}>
            <div className={classnames(grid.col6, grid.push1, css.license)}>
              <a
                rel="license"
                href="http://creativecommons.org/licenses/by-nc-sa/4.0/">
                <img
                  alt="Creative Commons License"
                  style={{ borderWidth: 0 }}
                  src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png"
                />
              </a>
              <p>
                {`This work is licensed under a `}
                <a
                  rel="license"
                  href="http://creativecommons.org/licenses/by-nc-sa/4.0/">
                  Creative Commons Attribution-NonCommercial-ShareAlike 4.0
                  International License
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div>
          This page is not translated, please refer to the
          <Link to={link}> english page</Link>
        </div>
      )}
    </Layout>
  );
};

export default RefTemplate;

export const query = graphql`
  query($name: String!, $assetsName: String!, $locale: String!) {
    json: file(fields: { name: { eq: $name }, lang: { eq: $locale } }) {
      childJson {
        name
        description
        syntax
        parameters {
          name
          description
          type
        }
        related
        returns
      }
    }
    images: allFile(
      filter: {
        relativeDirectory: { eq: $assetsName }
        extension: { regex: "/(jpg)|(jpeg)|(png)|(gif)/" }
      }
    ) {
      edges {
        node {
          name
          internal {
            content
          }
          extension
          childImageSharp {
            fixed {
              ...GatsbyImageSharpFixed
            }
          }
        }
      }
    }
    pdes: allFile(
      filter: {
        relativeDirectory: { eq: $assetsName }
        extension: { regex: "/(pde)/" }
      }
    ) {
      edges {
        node {
          name
          internal {
            content
          }
          extension
        }
      }
    }
    items: allFile(
      filter: {
        fields: { lang: { eq: "en" }, lib: { eq: "processing" } }
        childJson: { type: { nin: ["method", "field"] } }
      }
    ) {
      nodes {
        name
        relativeDirectory
        childJson {
          name
          brief
          category
          subcategory
          syntax
          parameters {
            name
            description
          }
          related
          returns
        }
      }
    }
  }
`;