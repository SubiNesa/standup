import { Injectable } from '@nestjs/common';

@Injectable()
export class GoalsService {

    colors = [
        'A10000',
        'A25203',
        '416600',
        '078446',
        '008282',
        '004182',
        '0021CB',
        '631DB4',
        '6A006A',
        '99004D',
        '0715CD',
        '626262',
        'B536DA',
        'E00707',
        'F2A400',
        '0E4603',
        '323232',
        '4AC925',
        'F141EF'
    ]

  getData(): any {
    return [{
        user: 'Thomas',
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        data: [
          [
            {
              ticket: 'JIRA-12',
              title: 'Something',
              days: 2,
              finish: 2,
              blocked: false,
              details: 'something something'
            },
            {
              ticket: 'JIRA-16',
              title: 'Something',
              days: 4,
              finish: 4,
              blocked: false,
              details: 'something something'
            }
          ],
          [
            {},
            {},
            {
              ticket: 'JIRA-13',
              title: 'Something',
              days: 1,
              finish: 1,
              blocked: false,
              details: 'something something'
            }
          ],
          null,
          [    
            {},
            {},
            {
              ticket: 'JIRA-14',
              title: 'Something',
              days: 1,
              finish: 1,
              blocked: false,
              details: 'something something'
            },
            {
              ticket: 'JIRA-15',
              title: 'Something',
              days: 1,
              finish: 1,
              blocked: false,
              details: 'something something'
            }
          ],
          null
        ]
      }];
  }
}
