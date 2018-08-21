/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { createSelector } from 'reselect';
import { LAYER_TYPE } from '../shared/layers/layer';
import { TileLayer } from '../shared/layers/tile_layer';
import { VectorLayer } from '../shared/layers/vector_layer';
import _ from 'lodash';

export const getMapConstants = ({ map }) => map && map.mapConstants;

export const getSelectedLayerInstance = ({ map }) => {
  if (!map.selectedLayer) {
    return null;
  }
  return createLayerInstance(map.selectedLayer);
};

function createLayerInstance(layerDescriptor) {
  if (layerDescriptor.type === TileLayer.type) {
    return new TileLayer(layerDescriptor);
  } else if (layerDescriptor.type === VectorLayer.type) {
    return new VectorLayer(layerDescriptor);
  } else {
    throw new Error(`Unrecognized layerType ${layerDescriptor.type}`);
  }
}

export const getLayerList = ({ map }) => map && map.layerList;

export const getLayerInstanceList = ({ map }) => {
  return map.layerList ?  map.layerList.map(layerDescriptor => createLayerInstance(layerDescriptor)) : [];
};

export const getLayerLoading = ({ map }) => map && map.layerLoading;

export const getTemporaryLayers = ({ map }) => map &&
  map.layerList.filter(({ temporary }) => temporary);

const getLayersById = createSelector(
  getLayerList,
  layerList => layerList.reduce((accu, layer) => ({ ...accu, [layer.id]: layer }), {})
);

export function getLayerById(state, id) {
  return createSelector(
    getLayersById,
    layersByIdList => _.get(layersByIdList, id)
  )(state);
}

export const getCurrentLayerStyle = createSelector(
  getLayerList,
  getSelectedLayerInstance,
  (layerList, layerInstance) => {
    const layer = layerInstance.getId() && layerList.find(layer => layerInstance.getId() === layer.id);
    return layer && layer.style;
  }
);

// Return selector instance for each component
export const makeGetStyleDescriptor = () => createSelector(
  getSelectedLayerInstance,
  selectedLayerInstance => {
    const isVector = selectedLayerInstance.getType() === LAYER_TYPE.VECTOR;
    const styleDescriptor = {
      vectorAdjustment: {
        name: 'Vector Adjustment',
        mods: [{
          name: 'colorPicker',
          apply: isVector
        }, {
          name: 'cssText',
          apply: isVector
        }]
      }
    };
    const filteredDescriptor = _.reduce(styleDescriptor, (accu, attrs, cat) => {
      const applicableMods = attrs.mods.filter(mod => mod.apply) || [];
      applicableMods.length && (accu[cat] = attrs);
      return accu;
    }, {});
    return filteredDescriptor;
  }
);