/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { injectI18n, FormattedMessage } from '@kbn/i18n/react';

import {
  EuiButtonEmpty,
  EuiFlexGroup,
  EuiFlexItem,
  EuiSpacer,
  EuiText,
  EuiTitle,
} from '@elastic/eui';

import {
  termsDetailsUrl,
} from '../../../services';

import {
  FieldChooser,
  FieldList,
} from './components';

export class StepTermsUi extends Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    onFieldsChange: PropTypes.func.isRequired,
    termsFields: PropTypes.array.isRequired,
  }

  onSelectField = (field) => {
    const {
      fields: { terms },
      onFieldsChange,
    } = this.props;

    onFieldsChange({ terms: terms.concat(field) });
  };

  onRemoveField = (field) => {
    const {
      fields: { terms },
      onFieldsChange,
    } = this.props;

    onFieldsChange({ terms: terms.filter(term => term !== field) });
  };

  render() {
    const {
      fields,
      termsFields,
    } = this.props;

    const {
      terms,
    } = fields;

    const unselectedTermsFields = termsFields.filter(termField => {
      return !fields.terms.includes(termField);
    });

    const columns = [{
      field: 'name',
      name: 'Field',
      truncateText: true,
      sortable: true,
    }, {
      field: 'type',
      name: 'Type',
      truncateText: true,
      sortable: true,
      width: '180px',
    }];

    return (
      <Fragment>
        <EuiFlexGroup justifyContent="spaceBetween">
          <EuiFlexItem grow={false}>
            <EuiTitle>
              <h3>
                <FormattedMessage
                  id="xpack.rollupJobs.create.stepTerms.title"
                  defaultMessage="Terms (optional)"
                />
              </h3>
            </EuiTitle>

            <EuiText>
              <p>
                <FormattedMessage
                  id="xpack.rollupJobs.create.stepTerms.description"
                  defaultMessage={`
                    Select the fields you want to bucket using terms aggregations. This can be
                    potentially costly for high-cardinality groups such as IP addresses, especially
                    if the time-bucket is particularly sparse.
                  `}
                />
              </p>
            </EuiText>
          </EuiFlexItem>

          <EuiFlexItem grow={false}>
            <EuiButtonEmpty
              size="s"
              flush="right"
              href={termsDetailsUrl}
              target="_blank"
              iconType="help"
            >
              <FormattedMessage
                id="xpack.rollupJobs.create.stepTerms.readDocsButton.label"
                defaultMessage="Read the docs"
              />
            </EuiButtonEmpty>
          </EuiFlexItem>
        </EuiFlexGroup>

        <FieldList
          columns={columns}
          fields={terms}
          onRemoveField={this.onRemoveField}
        />

        <EuiSpacer />

        <FieldChooser
          buttonLabel={(
            <FormattedMessage
              id="xpack.rollupJobs.create.stepTerms.fieldsChooser.label"
              defaultMessage="Select terms fields"
            />
          )}
          columns={columns}
          fields={unselectedTermsFields}
          onSelectField={this.onSelectField}
        />
      </Fragment>
    );
  }
}

export const StepTerms = injectI18n(StepTermsUi);