// import {
//   addEdge,
//   ConnectionLineType,
//   Handle,
//   Panel,
//   Position,
//   ReactFlow,
//   useEdgesState,
//   useNodesState,
// } from '@xyflow/react';
// import '@xyflow/react/dist/style.css';
// import classNames from 'classnames';
// import { layoutFromMap } from 'entitree-flex';
// import { memo, useCallback } from 'react';
// "@xyflow/react": "^12.0.4", "entitree-flex": "^0.4.1",

// const { Top, Bottom, Left, Right } = Position;

//initialTree
export const CFlow = ({}: any) => {
  // const treeRootId = initialTree[Object.keys(initialTree)[0]]['id'];
  // const { nodes: layoutedNodes, edges: layoutedEdges } = layoutElements(initialTree, treeRootId, 'TB');
  // const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  // const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

  // const onConnect = useCallback(
  //   params => setEdges(eds => addEdge({ ...params, type: ConnectionLineType.SmoothStep, animated: true }, eds)),
  //   [],
  // );
  // const onLayout = useCallback(
  //   direction => {
  //     const { nodes: layoutedNodes, edges: layoutedEdges } = layoutElements(initialTree, treeRootId, direction);

  //     setNodes([...layoutedNodes]);
  //     setEdges([...layoutedEdges]);
  //   },
  //   [nodes, edges],
  // );
  return 's';
  // <ReactFlow
  //   nodes={nodes}
  //   edges={edges}
  //   onNodesChange={onNodesChange}
  //   onEdgesChange={onEdgesChange}
  //   onConnect={onConnect}
  //   connectionLineType={ConnectionLineType.SmoothStep}
  //   fitView
  //   nodeTypes={nodeTypes}
  // >
  //   <Panel position='top-right'>
  //     <button onClick={() => onLayout('TB')}>vertical layout</button>
  //     <button onClick={() => onLayout('LR')}>horizontal layout</button>
  //   </Panel>
  // </ReactFlow>
};

// const nodeTypes: any = {
//   custom: memo(({ data }: any) => {
//     const { isSpouse, isSibling, direction } = data;

//     const isTreeHorizontal = direction === 'LR';

//     const getTargetPosition = () => {
//       if (isSpouse) {
//         return isTreeHorizontal ? Top : Left;
//       } else if (isSibling) {
//         return isTreeHorizontal ? Bottom : Right;
//       }
//       return isTreeHorizontal ? Left : Top;
//     };

//     const isRootNode = data?.isRoot;
//     const hasChildren = !!data?.children?.length;
//     const hasSiblings = !!data?.siblings?.length;
//     const hasSpouses = !!data?.spouses?.length;

//     return (
//       <div className='nodrag'>
//         {/* For children */}
//         {hasChildren && (
//           <Handle type='source' position={isTreeHorizontal ? Right : Bottom} id={isTreeHorizontal ? Right : Bottom} />
//         )}

//         {/* For spouses */}
//         {hasSpouses && (
//           <Handle type='source' position={isTreeHorizontal ? Bottom : Right} id={isTreeHorizontal ? Bottom : Right} />
//         )}

//         {/* For siblings */}
//         {hasSiblings && (
//           <Handle type='source' position={isTreeHorizontal ? Top : Left} id={isTreeHorizontal ? Top : Left} />
//         )}

//         {/* Target Handle */}
//         {!isRootNode && <Handle type={'target'} position={getTargetPosition()} id={getTargetPosition()} />}
//         <div
//           className={classNames(' flex justify-center items-center rounded border h-40 px-2', {
//             'w-80': data.attribute.type === 1 || data.attribute.type === 2,
//             'w-40': data.attribute.type !== 1 || data.attribute.type !== 2,
//             'bg-error': data.attribute.status === -1,
//             'bg-info': data.attribute.status === 0,
//             'bg-warning': data.attribute.status === 1,
//           })}
//         >
//           {data.attribute.type === 1 || data.attribute.type === 2 ? (
//             <div className='flex gap-3 items-center'>
//               <div>
//                 <img className='w-32' src='https://via.placeholder.com/640x480.png/00cc11?text=quam' alt='' />
//               </div>
//               <table className='text-[10px] leading-loose w-48'>
//                 <thead></thead>
//                 <tbody>
//                   <tr>
//                     <td>
//                       <strong>CPU:</strong> <br />
//                       {data.attribute.cpu}
//                     </td>
//                     <td>
//                       <strong>RAM:</strong> <br /> {data.attribute.ram}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td>
//                       <strong>Speed:</strong> <br /> {data.attribute.speed}
//                     </td>
//                     <td>
//                       <strong>Online:</strong> <br /> {data.attribute.online}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td>
//                       <strong>Offline:</strong> <br /> {data.attribute.offline}
//                     </td>
//                     <td>
//                       <strong>Error:</strong> <br /> {data.attribute.error}
//                     </td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <img className='w-32' src='https://via.placeholder.com/640x480.png/00cc11?text=quam' alt='' />
//           )}
//         </div>
//       </div>
//     );
//   }),
// };
// const Orientation = {
//   Vertical: 'vertical',
//   Horizontal: 'horizontal',
// };

// const entitreeSettings = {
//   clone: true, // returns a copy of the input, if your application does not allow editing the original object
//   enableFlex: true, // has slightly better perfomance if turned off (node.width, node.height will not be read)
//   firstDegreeSpacing: 10, // spacing in px between nodes belonging to the same source, eg children with same parent
//   nextAfterAccessor: 'spouses', // the side node prop used to go sideways, AFTER the current node
//   nextAfterSpacing: 100, // the spacing of the "side" nodes AFTER the current node
//   nextBeforeAccessor: 'siblings', // the side node prop used to go sideways, BEFORE the current node
//   nextBeforeSpacing: 100, // the spacing of the "side" nodes BEFORE the current node
//   nodeHeight: 150, // default node height in px
//   nodeWidth: 320, // default node width in px
//   orientation: Orientation.Vertical, // "vertical" to see parents top and children bottom, "horizontal" to see parents left and
//   rootX: 0, // set root position if other than 0
//   rootY: 0, // set root position if other than 0
//   secondDegreeSpacing: 100, // spacing in px between nodes not belonging to same parent eg "cousin" nodes
//   sourcesAccessor: 'parents', // the prop used as the array of ancestors ids
//   sourceTargetSpacing: 100, // the "vertical" spacing between nodes in vertical orientation, horizontal otherwise
//   targetsAccessor: 'children', // the prop used as the array of children ids
// };

// const layoutElements = (tree: any, rootId: any, direction = 'TB') => {
//   const isTreeHorizontal = direction === 'LR';

//   const { nodes: entitreeNodes, rels: entitreeEdges }: any = layoutFromMap(rootId, tree, {
//     ...entitreeSettings,
//     orientation: isTreeHorizontal ? Orientation.Horizontal : (Orientation.Vertical as any),
//   });

//   const nodes: any = [],
//     edges: any = [];

//   entitreeEdges.forEach(edge => {
//     const sourceNode = edge.source.id;
//     const targetNode = edge.target.id;

//     const newEdge: any = {};

//     newEdge.id = 'e' + sourceNode + targetNode;
//     newEdge.source = sourceNode;
//     newEdge.target = targetNode;
//     newEdge.type = 'smoothstep';
//     newEdge.animated = 'true';

//     // Check if target node is spouse or sibling
//     const isTargetSpouse = !!edge.target.isSpouse;
//     const isTargetSibling = !!edge.target.isSibling;

//     if (isTargetSpouse) {
//       newEdge.sourceHandle = isTreeHorizontal ? Bottom : Right;
//       newEdge.targetHandle = isTreeHorizontal ? Top : Left;
//     } else if (isTargetSibling) {
//       newEdge.sourceHandle = isTreeHorizontal ? Top : Left;
//       newEdge.targetHandle = isTreeHorizontal ? Bottom : Right;
//     } else {
//       newEdge.sourceHandle = isTreeHorizontal ? Right : Bottom;
//       newEdge.targetHandle = isTreeHorizontal ? Left : Top;
//     }

//     edges.push(newEdge);
//   });

//   entitreeNodes.forEach(node => {
//     const newNode: any = {};

//     const isSpouse = !!node?.isSpouse;
//     const isSibling = !!node?.isSibling;
//     const isRoot = node?.id === rootId;

//     if (isSpouse) {
//       newNode.sourcePosition = isTreeHorizontal ? Bottom : Right;
//       newNode.targetPosition = isTreeHorizontal ? Top : Left;
//     } else if (isSibling) {
//       newNode.sourcePosition = isTreeHorizontal ? Top : Left;
//       newNode.targetPosition = isTreeHorizontal ? Bottom : Right;
//     } else {
//       newNode.sourcePosition = isTreeHorizontal ? Right : Bottom;
//       newNode.targetPosition = isTreeHorizontal ? Left : Top;
//     }

//     newNode.data = { label: node.name, direction, isRoot, ...node };
//     newNode.id = node.id;
//     newNode.type = 'custom';

//     newNode.position = {
//       x: node.x,
//       y: node.y,
//     };
//     if (node.attribute.type === 1 || node.attribute.type === 2) {
//       newNode.data.groupMaxWidth = 288;
//     }

//     nodes.push(newNode);
//   });

//   return { nodes, edges };
// };
