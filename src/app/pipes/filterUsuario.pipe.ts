import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterUsuario'
})
export class FilterPipeUsuario implements PipeTransform {

  transform(value: any, arg= ''): any {
    if (arg === '' || arg.length < 1) return value;
    const resultPosts = [];
    for (const post of value) {
      if (post.usuario.toLowerCase().indexOf(arg.toLowerCase()) > -1) {
        resultPosts.push(post);
      };
    };
    return resultPosts;
  }


}