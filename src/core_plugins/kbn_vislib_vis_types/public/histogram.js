/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { VisFactoryProvider } from 'ui/vis/vis_factory';
import { Schemas } from 'ui/vis/editors/default/schemas';
import { CATEGORY } from 'ui/vis/vis_category';
import pointSeriesTemplate from './editors/point_series.html';

export default function PointSeriesVisType(Private, i18n) {
  const VisFactory = Private(VisFactoryProvider);

  return VisFactory.createVislibVisualization({
    name: 'histogram',
    title: i18n('kbnVislibVisTypes.histogram.histogramTitle', { defaultMessage: 'Vertical Bar' }),
    icon: 'visBarVertical',
    description: i18n('kbnVislibVisTypes.histogram.histogramDescription',
      { defaultMessage: 'Assign a continuous variable to each axis' }
    ),
    category: CATEGORY.BASIC,
    visConfig: {
      defaults: {
        type: 'histogram',
        grid: {
          categoryLines: false,
          style: {
            color: '#eee'
          }
        },
        categoryAxes: [
          {
            id: 'CategoryAxis-1',
            type: 'category',
            position: 'bottom',
            show: true,
            style: {},
            scale: {
              type: 'linear'
            },
            labels: {
              show: true,
              truncate: 100
            },
            title: {}
          }
        ],
        valueAxes: [
          {
            id: 'ValueAxis-1',
            name: 'LeftAxis-1',
            type: 'value',
            position: 'left',
            show: true,
            style: {},
            scale: {
              type: 'linear',
              mode: 'normal'
            },
            labels: {
              show: true,
              rotate: 0,
              filter: false,
              truncate: 100
            },
            title: {
              text: 'Count'
            }
          }
        ],
        seriesParams: [
          {
            show: 'true',
            type: 'histogram',
            mode: 'stacked',
            data: {
              label: 'Count',
              id: '1'
            },
            valueAxis: 'ValueAxis-1',
            drawLinesBetweenPoints: true,
            showCircles: true
          }
        ],
        addTooltip: true,
        addLegend: true,
        legendPosition: 'right',
        times: [],
        addTimeMarker: false,
      },
    },
    editorConfig: {
      collections: {
        positions: ['top', 'left', 'right', 'bottom'],
        chartTypes: [{
          value: 'line',
          text: 'line'
        }, {
          value: 'area',
          text: 'area'
        }, {
          value: 'histogram',
          text: 'bar'
        }],
        axisModes: ['normal', 'percentage', 'wiggle', 'silhouette'],
        scaleTypes: ['linear', 'log', 'square root'],
        chartModes: ['normal', 'stacked'],
        interpolationModes: [{
          value: 'linear',
          text: 'straight',
        }, {
          value: 'cardinal',
          text: 'smoothed',
        }, {
          value: 'step-after',
          text: 'stepped',
        }],
      },
      optionTabs: [
        {
          name: 'advanced',
          title: 'Metrics & Axes',
          editor: '<div><vislib-series></vislib-series><vislib-value-axes>' +
          '</vislib-value-axes><vislib-category-axis></vislib-category-axis></div>'
        },
        { name: 'options', title: 'Panel Settings', editor: pointSeriesTemplate },
      ],
      schemas: new Schemas([
        {
          group: 'metrics',
          name: 'metric',
          title: i18n('kbnVislibVisTypes.histogram.metricTitle', { defaultMessage: 'Y-Axis' }),
          min: 1,
          aggFilter: ['!geo_centroid', '!geo_bounds'],
          defaults: [
            { schema: 'metric', type: 'count' }
          ]
        },
        {
          group: 'metrics',
          name: 'radius',
          title: i18n('kbnVislibVisTypes.histogram.radiusTitle', { defaultMessage: 'Dot Size' }),
          min: 0,
          max: 1,
          aggFilter: ['count', 'avg', 'sum', 'min', 'max', 'cardinality']
        },
        {
          group: 'buckets',
          name: 'segment',
          title: i18n('kbnVislibVisTypes.histogram.segmentTitle', { defaultMessage: 'X-Axis' }),
          min: 0,
          max: 1,
          aggFilter: ['!geohash_grid', '!filter']
        },
        {
          group: 'buckets',
          name: 'group',
          title: i18n('kbnVislibVisTypes.histogram.groupTitle', { defaultMessage: 'Split Series' }),
          min: 0,
          max: 3,
          aggFilter: ['!geohash_grid', '!filter']
        },
        {
          group: 'buckets',
          name: 'split',
          title: i18n('kbnVislibVisTypes.histogram.splitTitle', { defaultMessage: 'Split Chart' }),
          min: 0,
          max: 1,
          aggFilter: ['!geohash_grid', '!filter']
        }
      ])
    }

  });
}
