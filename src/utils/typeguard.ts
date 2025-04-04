import type { BinaryOpNode, RootNode } from "../nodes/OpNodes";
import type { ConstantNode } from "../nodes/ConstantNode";
import type { ExprNode } from "../nodes/ExprNode";
import type { NumberNode } from "../nodes/NumberNode";
import type { PowerNode } from '../nodes/OpNodes';
import type { UnaryOpNode } from '../nodes/OpNodes';

export function isNumberNode(node: ExprNode): node is NumberNode {
  return node.type === 'Number';
}

export function isUnaryOpNode(node: ExprNode): node is UnaryOpNode {
  return node.type === 'UnaryOp';
}

export function isBinaryOpNode(node: ExprNode): node is BinaryOpNode {
  return node.type === 'BinaryOp';
}

export function isRootNode(node: ExprNode): node is RootNode {
  return node.type === 'Root';
}

export function isConstantNode(node: ExprNode): node is ConstantNode {
  return node.type === 'Constant';
}

export function isPowerNode(node: ExprNode): node is PowerNode {
  return node.type === 'Power';
}