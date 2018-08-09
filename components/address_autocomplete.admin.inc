<?php

include_once DRUPAL_ROOT . '/includes/locale.inc';

/**
 * Implementation of hook_form().
 */
function address_autocomplete_form($form, &$form_state) {
  $form = array();
  $options = country_get_list();
  array_unshift($options , 'All');
  $form['api_key'] = array(
    '#type' => 'textfield',
    '#title' => t('API Key'),
    '#default_value' => !empty(variable_get('api_key')) ? variable_get('api_key') : '',
    '#size' => 50,
    '#description' => t('Set the API key for autocomplete address field.'),
    '#required' => TRUE,
  );
  $form['countries'] = array(
    '#type' => 'select',
    '#title' => t('Select country'),
    '#description' => t('The country selected will be passed to google api for putting restrictions.'),
    '#options' => $options,
    '#default_value' => !empty(variable_get('country_selected')) ? variable_get('country_selected') : '',
  );
  $form['#submit'][] = 'address_autocomplete_form_submit';

  return system_settings_form($form);
}

/**
 * Implementation of hook_form_submit().
 */
function address_autocomplete_form_submit($form, &$form_state) {
  $api_key = $form_state['values']['api_key'];
  $country_selected = $form_state['values']['countries'];
  variable_set('api_key', $api_key);
  variable_set('country_selected', $country_selected);
}
