/* eslint no-undef:0, no-unused-expressions:0, no-sequences:0, no-return-assign:0 */

// The d3 chart on the page /os/

const diameter = 1000;
const radius = diameter / 2;
const innerRadius = radius - 160;

const cluster = d3.cluster().size([360, innerRadius]);

const vipLibs = ["detergent", "email-comb", "html-crush", "emlint"];

const line = d3
  .radialLine()
  .curve(d3.curveBundle.beta(0.85))
  .radius((d) => d.y)
  .angle((d) => (d.x / 180) * Math.PI);

const svg = d3
  .select(".interdeps__container")
  .insert("svg", "#interdeps__caption")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", `0 0 ${diameter} ${diameter}`)
  .append("g")
  .attr("transform", `translate(${radius},${radius})`);

svg
  .append("circle")
  .attr("cx", 0)
  .attr("cy", 0)
  .attr("r", radius)
  .attr("class", "circle-bg");

let link = svg.append("g").selectAll(".link");
let node = svg.append("g").selectAll(".node");

d3.json("/assets/REPLACE_WITH_HASH_URL/js/interdeps.json", (error, classes) => {
  if (error) throw error;

  const root = packageHierarchy(classes).sum((d) => {
    return d.size;
  });

  cluster(root);

  link = link
    .data(packageImports(root.leaves()))
    .enter()
    .append("path")
    .each((d) => {
      (d.source = d[0]), (d.target = d[d.length - 1]);
    })
    .attr("class", "link")
    .attr("d", line);

  node = node
    .data(root.leaves())
    .enter()
    .append("a")
    .attr("href", (d) => {
      return `/os/${d.data.key}`;
    })
    .append("text")
    .attr("class", "node")
    .attr("dy", "0.31em")
    .attr("transform", (d) => {
      return `rotate(${d.x - 90})translate(${d.y + 8},0)${
        d.x < 180 ? "" : "rotate(180)"
      }`;
    })
    .attr("text-anchor", (d) => {
      return d.x < 180 ? "start" : "end";
    })
    .text((d) => {
      // shorten the labels
      if (d.data.key.length > 22) {
        let val = d.data.key;
        let count = 0;
        while (val.length > 22 && count < 10) {
          count++;
          val = val
            .split("-")
            // remove last chunk
            .filter((v, i, a) => i !== a.length - 1)
            .join("-");
        }
        return `${vipLibs.includes(d.data.key) ? "⭐ " : ""}${val}...`;
      }
      return `${vipLibs.includes(d.data.key) ? "⭐ " : ""}${d.data.key}`;
    })
    .on("mouseover", mouseovered)
    .on("mouseout", mouseouted)
    .append("title")
    .text((d) => d.data.key);
});

function mouseovered(d) {
  node.each((n) => {
    n.target = false;
    n.source = false;
  });

  link
    .classed("link--target", (l) => {
      if (l.target === d) return (l.source.source = true);
    })
    .classed("link--source", (l) => {
      if (l.source === d) return (l.target.target = true);
    })
    .filter((l) => {
      return l.target === d || l.source === d;
    })
    .raise();

  node
    .classed("node--target", (n) => {
      return n.target;
    })
    .classed("node--source", (n) => {
      return n.source;
    });
}

function mouseouted() {
  link.classed("link--target", false).classed("link--source", false);

  node.classed("node--target", false).classed("node--source", false);
}

// Lazily construct the package hierarchy from class names.
function packageHierarchy(classes) {
  const map = {};

  function find(name, data) {
    let currNode = map[name];
    let i;
    if (!currNode) {
      map[name] = data || { name, children: [] };
      currNode = map[name];
      if (name.length) {
        currNode.parent = find(name.substring(0, (i = name.lastIndexOf("."))));
        currNode.parent.children.push(currNode);
        currNode.key = name.substring(i + 1);
      }
    }
    return currNode;
  }

  classes.forEach((d) => {
    find(d.name, d);
  });

  return d3.hierarchy(map[""]);
}

function packageImports(nodes) {
  const map = {};
  const imports = [];

  // Compute a map from name to node.
  nodes.forEach((d) => {
    map[d.data.name] = d;
  });

  // For each import, construct a link from the source to target node.
  nodes.forEach((d) => {
    if (d.data.imports) {
      d.data.imports.forEach((i) => {
        imports.push(map[d.data.name].path(map[i]));
      });
    }
  });

  return imports;
}
