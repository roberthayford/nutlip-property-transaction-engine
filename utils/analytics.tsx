'use client';

import { event } from '@next/third-parties/google';

// Transaction stage tracking
export function trackStageTransition(fromStage: string, toStage: string) {
  event('stage_transition', {
    category: 'transaction_flow',
    label: `${fromStage}_to_${toStage}`,
    from_stage: fromStage,
    to_stage: toStage
  });
}

// Document interaction tracking
export function trackDocumentAction(actionType: 'view' | 'download' | 'upload', documentType: string) {
  event('document_action', {
    category: 'user_interaction',
    label: `${actionType}_${documentType}`,
    action_type: actionType,
    document_type: documentType
  });
}

// Form interaction tracking
export function trackFormEvent(formName: string, eventType: 'start' | 'complete' | 'abandon') {
  event('form_event', {
    category: 'user_interaction',
    label: `${formName}_${eventType}`,
    form_name: formName,
    event_type: eventType
  });
}

// Feature usage tracking
export function trackFeatureUsage(featureName: string, action: string) {
  event('feature_usage', {
    category: 'engagement',
    label: `${featureName}_${action}`,
    feature_name: featureName,
    action: action
  });
}

// Chat/messaging tracking
export function trackMessageEvent(conversationType: string, action: 'sent' | 'received' | 'viewed') {
  event('message_event', {
    category: 'communication',
    label: `${conversationType}_${action}`,
    conversation_type: conversationType,
    action: action
  });
}

// Error tracking
export function trackError(errorType: string, errorMessage: string) {
  event('error_occurred', {
    category: 'errors',
    label: errorType,
    error_type: errorType,
    error_message: errorMessage
  });
}
