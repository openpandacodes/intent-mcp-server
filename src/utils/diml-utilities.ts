// diml-utils.ts - Utilities for handling DIML XML (continued)

import { XMLBuilder, XMLParser } from 'fast-xml-parser';
import { DeepFlow, DIMLDeepFlow, FlowResource, FlowStep } from '../types/type-definitions';

export class DIMLUtils {
  private static xmlParser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    allowBooleanAttributes: true
  });
  
  private static xmlBuilder = new XMLBuilder({
    format: true,
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    suppressEmptyNode: true
  });
  
  /**
   * Converts a DeepFlow object to DIML XML string
   */
  static convertToDIML(flow: DeepFlow): string {
    const dimlObject: DIMLDeepFlow = {
      id: flow.id,
      intent: flow.intentId,
      metadata: {
        author: flow.metadata.author,
        created: flow.metadata.created.toISOString(),
        estimatedCost: flow.metadata.estimatedCost.toString(),
        estimatedDuration: flow.metadata.estimatedDuration
      },
      resources: {
        resource: flow.resources.map(r => ({
          id: r.id,
          type: r.type,
          provider: r.provider
        }))
      },
      steps: {
        step: flow.steps.map(s => ({
          id: s.id,
          depends: s.depends,
          action: {
            resource: s.action.resource,
            query: s.action.query,
            output: {
              bind: s.action.output
            }
          }
        }))
      },
      output: {
        combine: {
          item: flow.output.combine.items.map(item => ({
            source: item
          }))
        }
      }
    };

    return this.xmlBuilder.build(dimlObject);
  }
  
  /**
   * Converts DIML XML string to a DeepFlow object
   */
  static dimlToDeepFlow(dimlXml: string): DeepFlow {
    // Parse XML to object
    const parsed = this.xmlParser.parse(dimlXml);
    const deepFlow = parsed.DeepFlow;
    
    // Extract resources
    const resources = Array.isArray(deepFlow.Resources.Resource) 
      ? deepFlow.Resources.Resource 
      : [deepFlow.Resources.Resource];
    
    // Extract steps
    const steps = Array.isArray(deepFlow.Steps.Step)
      ? deepFlow.Steps.Step
      : [deepFlow.Steps.Step];
    
    // Extract output items
    const outputItems = Array.isArray(deepFlow.Output.Combine.Item)
      ? deepFlow.Output.Combine.Item
      : [deepFlow.Output.Combine.Item];
    
    // Convert to DeepFlow object
    return {
      id: deepFlow["@_id"],
      intentId: deepFlow["@_intent"],
      metadata: {
        author: deepFlow.Metadata.Author,
        created: deepFlow.Metadata.Created,
        estimatedCost: parseFloat(deepFlow.Metadata.EstimatedCost),
        estimatedDuration: deepFlow.Metadata.EstimatedDuration
      },
      resources: resources.map((r: any) => ({
        id: r["@_id"],
        type: r["@_type"],
        provider: r["@_provider"]
      })),
      steps: steps.map((s: any) => ({
        id: s["@_id"],
        depends: s["@_depends"],
        action: {
          resource: s.Action["@_resource"],
          query: s.Action.Query["#text"] || s.Action.Query,
          output: s.Action.Output["@_bind"]
        }
      })),
      output: {
        combine: {
          items: outputItems.map((i: any) => i["@_source"])
        }
      },
      naturalLanguageDescription: "" // This field is not part of DIML, would need to be populated separately
    };
  }
  
  /**
   * Validates if a DIML XML string is well-formed and follows the DIML schema
   */
  static validateDIML(dimlXml: string): { valid: boolean, errors?: string[] } {
    try {
      // Basic XML parsing validation
      const parsed = this.xmlParser.parse(dimlXml);
      
      const errors: string[] = [];
      
      // Check for required root element
      if (!parsed.DeepFlow) {
        errors.push("Missing root DeepFlow element");
      }
      
      // Check for required attributes
      if (!parsed.DeepFlow?.["@_id"]) {
        errors.push("Missing id attribute on DeepFlow element");
      }
      
      if (!parsed.DeepFlow?.["@_intent"]) {
        errors.push("Missing intent attribute on DeepFlow element");
      }
      
      // Check for required sections
      if (!parsed.DeepFlow?.Metadata) {
        errors.push("Missing Metadata section");
      }
      
      if (!parsed.DeepFlow?.Resources) {
        errors.push("Missing Resources section");
      }
      
      if (!parsed.DeepFlow?.Steps) {
        errors.push("Missing Steps section");
      }
      
      if (!parsed.DeepFlow?.Output) {
        errors.push("Missing Output section");
      }
      
      // Return validation result
      return {
        valid: errors.length === 0,
        errors: errors.length > 0 ? errors : undefined
      };
    } catch (error) {
      return {
        valid: false,
        errors: [(error as Error).message]
      };
    }
  }
  
  /**
   * Pretty-prints a DIML XML string with proper indentation
   */
  static formatDIML(dimlXml: string): string {
    try {
      const parsed = this.xmlParser.parse(dimlXml);
      return `<?xml version="1.0" encoding="UTF-8"?>\n${this.xmlBuilder.build(parsed)}`;
    } catch (error) {
      throw new Error(`Failed to format DIML: ${(error as Error).message}`);
    }
  }
}
